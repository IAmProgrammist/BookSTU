import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import { useGetBookListQuery } from "../../../redux/api/baseApi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { BookListQuery, BookState } from "../../../redux/types/book";
import { usePermissions } from "hooks/usePermissions";
import { BOOK_STATE_NAMES } from "dicts";

const PAGE_SIZE = 15;

export function BookListPage() {
    const { bookDescriptionId = null } = useParams();

    const navigate = useNavigate();

    const { params, patchParams } = useSearchParamsFilter<Pick<BookListQuery, "q" | "ordering" | "page" | "state">>(bookDescriptionId ? `books-${bookDescriptionId}` : "books");

    const [localSearchString, setLocalSearchString] = useState({ val: "", byUser: false });
    const { data, isLoading, isError, error, isSuccess } = useGetBookListQuery({
        q: params?.q,
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        state: params?.state,
        description: bookDescriptionId
    });

    useShowError({
        isError,
        error
    });

    useEffect(() => {
        if (!isError) return;
        if ((error as any)?.status === 404 && (error as any)?.data?.detail?.startsWith("Invalid page") && params.page != 1) {
            patchParams({ page: 1 });
        }
    }, [isError, error]);

    useEffect(() => {
        setLocalSearchString({ val: params?.q ?? "", byUser: false });
    }, [params?.q])

    const debouncedLocalSearchString = useDebounce(localSearchString, 500);

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (!debouncedLocalSearchString.byUser) return;

        patchParams({ q: debouncedLocalSearchString.val ?? null });
    }, [debouncedLocalSearchString]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowCreate = useMemo(() => {
        return bookDescriptionId && permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.add_book") !== -1;
    }, [permissions, permissionsIsSuccess, bookDescriptionId]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                    value={localSearchString.val}
                    onChange={(ev) => setLocalSearchString({ val: ev.target.value, byUser: true })}
                    label="Поиск" />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="ordering">Сортировка</InputLabel>
                    <Select
                        labelId="ordering"
                        id="ordering"
                        value={params?.ordering ?? null}
                        label="Сортировка"
                        onChange={(event) => {
                            patchParams({ ordering: event.target.value });
                        }}
                    >
                        <MenuItem value={null}>Без сортировки</MenuItem>
                        <MenuItem value="inventory_number">По инв. номеру (A-Z)</MenuItem>
                        <MenuItem value="-inventory_number">По инв. номеру (Z-A)</MenuItem>
                        <MenuItem value="state">Сначала новые</MenuItem>
                        <MenuItem value="-state">Сначала старые</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="state">Состояние</InputLabel>
                    <Select
                        multiple
                        labelId="state"
                        id="state"
                        value={params?.state ?? []}
                        label="Состояние"
                        onChange={(event) => {
                            patchParams({ state: event.target.value as BookState[] });
                        }}
                    >
                        {Object.values(BookState).map((item) => <MenuItem value={item}>{BOOK_STATE_NAMES[item]}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowCreate ? <Button onClick={() => navigate(`/book-descriptions/${bookDescriptionId}/books/create`)}>Создать</Button> : null}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Книг не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/books/${item.id}`)}>
                        <CardHeader
                            title={item.inventory_number}
                            subheader={<>Состояние: {BOOK_STATE_NAMES[item.state]}</>} />
                    </CardActionArea>
                </Card>)}
            </Box>) : null}
        {data?.next || data?.previous ? <Pagination
            count={Math.ceil(data?.count / PAGE_SIZE)}
            page={params?.page}
            onChange={(_ev, page) => patchParams({ page })} /> : null}
    </Container>
}