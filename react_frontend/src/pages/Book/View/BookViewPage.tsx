import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteBookMutation, useGetCSRFQuery, useGetBookQuery, useGetBookDescriptionQuery, useGetJournalListQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { BOOK_STATE_NAMES } from "dicts";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { JournalListQuery } from "redux/types/journal";
import dayjs from "dayjs";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const PAGE_SIZE = 15;

export function BookViewPage() {
    const { bookId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteBook, deleteBookStatus] = useDeleteBookMutation();
    const { data, isError, error, isLoading, isSuccess } = useGetBookQuery({ id: bookId });
    const navigate = useNavigate();

    useShowError({
        isError, error
    });


    const {
        data: bookDescriptionData,
        ...bookDescriptionStatus
    } = useGetBookDescriptionQuery({ id: data?.description }, { skip: !data?.description });

    useShowError({
        isError: bookDescriptionStatus.isError,
        error: bookDescriptionStatus.error
    });

    useShowError({
        isError: deleteBookStatus.isError,
        error: deleteBookStatus.error
    });

    useEffect(() => {
        if (!deleteBookStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Книга успешно удалена",
            variant: "success",
        })
        navigate(`/book-descriptions/${data.description}`)
    }, [deleteBookStatus]);

    const { params, patchParams } = useSearchParamsFilter<Pick<JournalListQuery, "ordering" | "page">>(`journal-book-${bookId}`);

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_book") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_book") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowJournal = useMemo(() => {
        return permissionsIsSuccess;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowCreateJournal = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.add_journal") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const { data: journalData, ...journalDataStatus } = useGetJournalListQuery({
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        book: bookId,
    }, { skip: !shouldShowJournal })

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/books")}>К списку книг</Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/books/${bookId}/update`)}>Обновить</Button>}
                {shouldShowDelete && <Button onClick={() => setDeleteOpen(true)}>Удалить</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <>
            <Card sx={{ width: "100%" }} variant="outlined">
                <CardActionArea onClick={() => navigate(`/book-descriptions/${data?.description}`)}>
                    <CardHeader
                        title={bookDescriptionStatus.isLoading ? "Загрузка..." : bookDescriptionData.name}
                        subheader={bookDescriptionStatus.isLoading ? "" : `ISBN: ${bookDescriptionData.isbn}`} />
                </CardActionArea>
            </Card>
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Typography variant="h4">{data.inventory_number}</Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="body1">Состояние: {BOOK_STATE_NAMES[data?.state]}</Typography>
                </CardContent>
            </Card></> : null}
        {shouldShowJournal && journalDataStatus.isSuccess ?
            <><Typography variant="h4" sx={{ alignSelf: "start" }}>Журнал передачи:</Typography>
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
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {shouldShowCreateJournal ? <Button onClick={() => navigate(`/books/${bookId}/journals/create`)}>Создать</Button> : null}
                        </Box>
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
        <ConfirmationDialog
            id="book-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить книгу, она будет удалена из списка книг."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deleteBook({ id: bookId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}