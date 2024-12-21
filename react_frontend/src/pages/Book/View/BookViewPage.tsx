import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteBookMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetBookQuery, useGetBookDescriptionQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Book } from "../../../redux/types/book";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { SP_ROOT } from "hooks/SearchParamsFilter";
import { BOOK_STATE_NAMES } from "dicts";

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


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_book") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_book") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
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
                <CardHeader
                    title={bookDescriptionStatus.isLoading ? "Загрузка..." : bookDescriptionData.name}
                    subheader={bookDescriptionStatus.isLoading ? "" : `ISBN: ${bookDescriptionData.isbn}`} />
            </Card>
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Typography variant="h4">{data.inventory_number}</Typography>
                </CardContent>
                <CardContent>
                    <Typography variant="body1">Состояние: {BOOK_STATE_NAMES[data?.state]}</Typography>
                </CardContent>
            </Card></> : null}
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