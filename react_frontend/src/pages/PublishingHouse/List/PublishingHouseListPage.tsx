import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { useGetPublishingHouseListQuery } from "../../../redux/api/baseApi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { PublishingHouseListQuery } from "redux/types/publishingHouse";
import { usePermissions } from "hooks/usePermissions";

const PAGE_SIZE = 15;

export function PublishingHouseListPage() {
    const navigate = useNavigate();

    const { params, patchParams } = useSearchParamsFilter<Pick<PublishingHouseListQuery, "q" | "ordering" | "page">>("publishing-house");

    const [localSearchString, setLocalSearchString] = useState({ val: "", byUser: false });
    const { data, isLoading, isError, error, isSuccess } = useGetPublishingHouseListQuery({
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
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.add_publishinghouse") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
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
                        <MenuItem value="name">По имени по возрастанию</MenuItem>
                        <MenuItem value="-name">По имени по убыванию</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowCreate ? <Button onClick={() => navigate(`/publishing-houses/create`)}>Создать</Button> : null}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Жанров не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/publishing-houses/${item.id}`)}>
                        <CardContent>
                            <Typography variant="h5">
                                {item.name}
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