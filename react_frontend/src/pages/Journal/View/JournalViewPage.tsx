import React, { useEffect, useMemo, useState } from "react";
import { useDeleteJournalMutation, useGetBookDescriptionQuery, useGetBookQuery, useGetCSRFQuery, useGetJournalQuery, useGetUserListQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { BOOK_STATE_NAMES } from "dicts";
import { ConfirmationDialog } from "components/ConfirmationDialog";
import { Whoops } from "components/Whoops";
import 'dayjs/locale/ru'
import dayjs from "dayjs";


export function JournalViewPage() {
    const { data: csrfData } = useGetCSRFQuery({});
    const { journalId } = useParams();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteJournal, deleteJournalStatus] = useDeleteJournalMutation();
    const {
        data: journalData,
        ...journalStatus
    } = useGetJournalQuery({
        id: journalId
    });

    const { isSuccess, isLoading, isError } = journalStatus;

    useShowError({
        isError: journalStatus.isError,
        error: journalStatus.error
    })

    const {
        data: bookData,
        ...bookStatus
    } = useGetBookQuery({ id: journalData?.book }, { skip: !journalData?.book });

    useShowError({
        isError: bookStatus.isError,
        error: bookStatus.error,
    })

    const {
        data: bookDescriptionData,
        ...bookDescriptionStatus
    } = useGetBookDescriptionQuery({ id: bookData?.description, short: true }, { skip: !bookStatus.isSuccess });

    useShowError({
        isError: bookDescriptionStatus.isError,
        error: bookDescriptionStatus.error,
    })

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.view_journal") === -1) {
                enqueueSnackbar({
                    message: "Недостаточно прав",
                    variant: "error",
                })
                navigate("/");
            }
        }
    }, [permissionsIsSuccess]);


    const [usersSelected, setUsersSelected] = useState([]);

    const { data: profiles, ...profilesStatus } = useGetUserListQuery({ id: [journalData?.user || 0] }, { skip: !journalStatus.isSuccess });

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_journal") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_journal") !== -1;
    }, [permissions, permissionsIsSuccess]);

    useEffect(() => {
        if (!profilesStatus.isSuccess) return;
        setUsersSelected(profiles?.results || []);
    }, [profilesStatus]);

    const isExpired = useMemo(() => {
        const until = dayjs(journalData?.end_date);
        const returning = dayjs(journalData?.returned_date);

        return until.diff(returning) < 0;
    }, [journalData]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/journals/${journalId}/update`)}>Обновить</Button>}
                {shouldShowDelete && <Button onClick={() => setDeleteOpen(true)}>Удалить</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Stack sx={{ width: "100%" }} spacing={2}>
            <Card sx={{ width: "100%" }} variant="outlined">
                <CardActionArea onClick={() => navigate(`/book-descriptions/${bookData?.description}`)}>
                    <CardHeader
                        title={<>{bookDescriptionStatus.isSuccess ? bookDescriptionData?.name : "Загрузка..."}</>}
                        subheader={<>{bookDescriptionStatus.isSuccess ? `ISBN: ${bookDescriptionData?.isbn}` : ""}<br />
                            {bookStatus.isSuccess ? `Инвентарный номер: ${bookData.inventory_number}` : ""}<br />
                            {bookStatus.isSuccess ? `Состояние: ${BOOK_STATE_NAMES[bookData.state]}` : ""}</>} />
                </CardActionArea>
            </Card>
            <Card variant="outlined">
                <CardActionArea onClick={() => navigate(`/users/${usersSelected[0].user.id}`)}>
                    <CardHeader
                        title={<>{!!usersSelected.length ? `${usersSelected[0].surname} ${usersSelected[0].name} ${usersSelected[0].patronymics}` : "Загрузка..."}</>}
                        subheader={<>{!!usersSelected.length ? `+7${usersSelected[0].phone_number}` : ""}<br />
                            {!!usersSelected.length ? `${usersSelected[0].user.username}` : ""}</>} />
                </CardActionArea>
            </Card>
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="body1">Выдано: {dayjs(journalData.begin_date).format("DD.MM.YYYY hh:mm")}</Typography>
                        <Typography variant="body1">Ожидается до: {dayjs(journalData.end_date).format("DD.MM.YYYY hh:mm")}</Typography>
                        <Typography variant="body1">{journalData.returned_date ? `Вовзращена ${dayjs(journalData.returned_date).format("DD.MM.YYYY hh:mm")}` :
                            "Пока ещё читается"}</Typography>
                        {isExpired ? <Typography sx={{ color: "red" }}>Просрочена</Typography> : null}
                    </Stack>
                </CardContent>
            </Card></Stack> : null}
        <ConfirmationDialog
            id="genre-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить запись в журнале, она будет удалена из журнала пользователя."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deleteJournal({ id: journalId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}