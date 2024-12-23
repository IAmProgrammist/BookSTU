import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Typography } from "@mui/material";
import { useGetUserListQuery } from "../../../redux/api/baseApi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { UserListQuery } from "redux/types/user";
import { usePermissions } from "hooks/usePermissions";

const PAGE_SIZE = 15;

export function UserListPage() {
    const navigate = useNavigate();

    const { params, patchParams } = useSearchParamsFilter<Pick<UserListQuery, "q" | "ordering" | "page" | "banned">>("users");

    const [localSearchString, setLocalSearchString] = useState({ val: "", byUser: false });
    const { data, isLoading, isError, error, isSuccess } = useGetUserListQuery({
        q: params?.q,
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        banned: params?.banned
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
                        <MenuItem value="surname">По имени по возрастанию</MenuItem>
                        <MenuItem value="-surname">По имени по убыванию</MenuItem>
                        <MenuItem value="banned">Сначала забаненные</MenuItem>
                        <MenuItem value="-banned">Сначала незабаненные</MenuItem>
                        <MenuItem value="user__username">По EMail по возрастанию</MenuItem>
                        <MenuItem value="-user__username">По EMail по убыванию</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="isBanned">Заблокирован</InputLabel>
                    <Select
                        labelId="isBanned"
                        id="isBanned"
                        value={params?.banned === null ? null : `${params?.banned}`}
                        label="Заблокирован"
                        onChange={(event) => {
                            patchParams({ banned: event.target.value === null ? null : event.target.value === "true" });
                        }}
                    >
                        <MenuItem value={null}>Любые</MenuItem>
                        <MenuItem value="true">Заблокированные</MenuItem>
                        <MenuItem value="false">Незаблокированные</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Пользователей не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/users/${item.id}`)}>
                        <CardContent>
                            <Stack spacing={1}>
                            <Typography variant="h5">
                                {item.surname} {`${item.name.substring(0, 1)}.`} {item.patronymics ? `${item.patronymics.substring(0, 1)}.` : null}
                            </Typography>
                            <Typography variant="body1">
                                Номер телефона: {item.phone_number ? `+7${item.phone_number}` : "не указан"}
                            </Typography>
                            <Typography variant="body1">
                                EMail: {item.user?.username ? `${item.user?.username}` : "не указан"}
                            </Typography>
                            </Stack>
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