import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetBookDescriptionListQuery, useGetBookListQuery, useGetJournalListQuery, useGetUserMeQuery, useGetUserQuery, usePatchUserMutation } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "hooks/usePermissions";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { Journal, JournalListQuery } from "redux/types/journal";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import { BOOK_STATE_NAMES } from "dicts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ENV_API_SERVER } from "envconsts";

const PAGE_SIZE = 15;

export function UserViewPage() {
    const { userId } = useParams();

    const { params, patchParams } = useSearchParamsFilter<Pick<JournalListQuery, "ordering" | "page">>(`journal-user-${userId}`);
    const { data: journalData, ...journalDataStatus } = useGetJournalListQuery({
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        user: userId,
    });
    const navigate = useNavigate();

    const { data, isError, isSuccess, isLoading, error } = useGetUserQuery({ id: userId });

    useShowError({
        isError, error
    });

    useShowError({
        isError: journalDataStatus.isError,
        error: journalDataStatus.error
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();
    const { data: meData, isSuccess: meIsSuccess } = useGetUserMeQuery({});

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && (permissions.findIndex((item) => item === "django_backend.change_profile") !== -1);
    }, [permissions, permissionsIsSuccess, meIsSuccess, meData]);

    const uniqueBooks = useMemo(() => {
        return [...new Set(journalData?.results?.map((item) => item.book) || [])];
    }, [journalData]);

    const { data: booksData, ...bookStatus } = useGetBookListQuery({ id: uniqueBooks, size: PAGE_SIZE }, { skip: uniqueBooks.length === 0 });

    const uniqueBookDescriptions = useMemo(() => {
        return [...new Set(booksData?.results?.map((item) => item.description) || [])];
    }, [booksData]);

    const { data: bookDescriptionsData, ...bookDescriptionStatus } = useGetBookDescriptionListQuery({
        id: uniqueBookDescriptions,
        size: PAGE_SIZE,
        short: true
    }, {
        skip: uniqueBookDescriptions.length === 0
    });

    const getJournalTitle = (item: Journal) => {
        const book = booksData?.results?.find?.(innerBook => innerBook.id === item.book);
        if (!book) return null;

        const bookDescription = bookDescriptionsData?.results?.find?.(innerBD => innerBD.id === book.description);
        if (!bookDescription) return null;

        return bookDescription.name;
    }

    const getJournalSubTitle = (item) => {
        const book = booksData?.results?.find?.(innerBook => innerBook.id === item.book);
        if (!book) return null;

        const bookDescription = bookDescriptionsData?.results?.find?.(innerBD => innerBD.id === book.description);
        if (!bookDescription) return null;

        return <>ISBN: {bookDescription?.isbn}<br />
            Инвентарный номер: {book.inventory_number}<br />
            Состояние: {BOOK_STATE_NAMES[book.state]}</>;
    }

    const [patchUser, patchUserStatus] = usePatchUserMutation();

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => patchUser({id: userId, banned: !data?.banned})}>{data?.banned ? "Разбанить" : "Забанить"}</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="h4">{data.name} {data.surname} {data.patronymics}</Typography>
                    <Typography variant="body1">
                        Номер телефона: {data.phone_number ? `+7${data.phone_number}` : "не указан"}
                    </Typography>
                    <Typography variant="body1">
                        EMail: {data.user?.username ? `${data.user?.username}` : "не указан"}
                    </Typography>
                    <Typography variant="body1">
                        Паспортные данные: {data.passport_data.substring(0, 4)} {data.passport_data.substring(4)}
                    </Typography>
                    {data.banned ? <Typography variant="body1">Аккаунт заблокирован. Обратитесь к администратору
                        или бибилотекарю для разблокировки
                    </Typography> : null}
                </Stack>
            </CardContent>
        </Card> : null}

        {journalDataStatus.isSuccess ?
            <><Typography variant="h4" sx={{ alignSelf: "start" }}>Журнал:</Typography>
                <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <Box sx={{ width: "100%", display: "flex" }}>
                        <Box sx={{ flexGrow: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                                    <MenuItem value="begin_date">Сначала старые записи</MenuItem>
                                    <MenuItem value="-begin_date">Сначала новые записи</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Button onClick={() => window.open(`${ENV_API_SERVER}/api/journals/export?user=${userId}&${params?.ordering ? 'ordering=' + params?.ordering : ''}`, 
                                                        '_blank')}>Экспортировать</Button>
                    </Box>
                    {journalDataStatus.isError ? <Whoops /> :
                        journalDataStatus.isLoading ? <CircularProgress /> : <></>}
                    {journalDataStatus.isSuccess ? (journalData.results.length == 0 ? <Whoops title="Записей в журнале не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, 1fr);",
                            gap: 2,
                            width: "100%",
                            my: 4
                        }}>
                            {journalData.results.map((item) => <Card variant="outlined" key={item.id}>
                                <CardActionArea onClick={() => navigate(`/journals/${item.id}`)}>
                                    <CardHeader
                                        title={bookDescriptionStatus.isSuccess && bookStatus.isSuccess ? getJournalTitle(item) : "Загрузка..."}
                                        subheader={bookDescriptionStatus.isSuccess && bookStatus.isSuccess ? getJournalSubTitle(item) : ""} />
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography variant="body1">Выдано: {dayjs(item.begin_date).format("DD.MM.YYYY hh:mm")}</Typography>
                                            <Typography variant="body1">Ожидается до: {dayjs(item.end_date).format("DD.MM.YYYY hh:mm")}</Typography>
                                            <Typography variant="body1">{item.returned_date ? `Вовзращена ${dayjs(item.returned_date).format("DD.MM.YYYY hh:mm")}` : "Пока ещё читается"}</Typography>
                                            {dayjs(item?.end_date).diff(dayjs(item?.returned_date)) < 0 ? <Typography sx={{ color: "red" }}>Просрочена</Typography> : null}
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>)}
                        </Box>) : null}
                    {journalData?.next || journalData?.previous ? <Pagination
                        count={Math.ceil(journalData?.count / PAGE_SIZE)}
                        page={params?.page}
                        onChange={(_ev, page) => patchParams({ page })} /> : null}
                </Container>
            </> : null}
    </Container>
}