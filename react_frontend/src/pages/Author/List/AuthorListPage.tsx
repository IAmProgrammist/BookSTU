import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { useGetAuthorListQuery } from "../../../redux/api/baseApi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { usePermissions } from "hooks/usePermissions";
import { AuthorListQuery } from "redux/types/author";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

const PAGE_SIZE = 15;

export function AuthorListPage() {
    const navigate = useNavigate();

    const { params, patchParams } = useSearchParamsFilter<Pick<AuthorListQuery, "q" | "ordering" | "page">>("authors");

    const [localSearchString, setLocalSearchString] = useState({ val: "", byUser: false });
    const { data, isLoading, isError, error, isSuccess } = useGetAuthorListQuery({
        q: params?.q,
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        short: true
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
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.add_author") !== -1;
    }, [permissions, permissionsIsSuccess]);

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
                        <MenuItem value="name">По фамилии по возрастанию</MenuItem>
                        <MenuItem value="-name">По фамилии по убыванию</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowCreate ? <Button onClick={() => navigate(`/authors/create`)}>Создать</Button> : null}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Авторов не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/authors/${item.id}`)}>
                        <CardMedia>
                            {item.icon ? <Box
                                sx={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover"
                                }}
                                component="img"
                                src={`${ENV_API_SERVER}/api/files/${item.icon}/`} /> :
                                <NoPhotographyIcon sx={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover"
                                }} />}
                        </CardMedia>
                        <CardContent>
                            <Typography variant="h5">
                                {item.surname} {`${item.name.substring(0, 1)}.`} {item.patronymics ? `${item.patronymics.substring(0, 1)}.` : null}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>)}
            </Box>) : null}
        {data?.next || data?.previous ? <Pagination
            count={Math.ceil(data?.count / PAGE_SIZE)}
            page={params?.page}
            onChange={(_ev, page) => patchParams({ page })} /> : null}
    </Container>
}