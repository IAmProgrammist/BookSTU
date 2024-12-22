import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteBookDescriptionMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetBookDescriptionQuery, useGetGenreListQuery, useGetPublishingHouseQuery, useGetAuthorListQuery } from "../../../redux/api/baseApi";
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { BookDescription } from "../../../redux/types/bookDescription";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { BookListPage } from "pages/Book/List";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function BookDescriptionViewPage() {
    const { bookDescriptionId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteBookDescription, deleteBookDescriptionStatus] = useDeleteBookDescriptionMutation();
    const { data, isError, error, isLoading, isSuccess } = useGetBookDescriptionQuery({ id: bookDescriptionId, short: false });
    const navigate = useNavigate();

    const { data: dataAuthors, ...authorsStatus } = useGetAuthorListQuery({ id: data?.authors?.length ? data?.authors : [0], size: 50, short: true }, { skip: !isSuccess });
    const { data: dataGenres, ...genresStatus } = useGetGenreListQuery({ id: data?.genres?.length ? data?.genres : [0], size: 50, short: true }, { skip: !isSuccess });
    const { data: publishingHouses, ...publishingHousesStatus } = useGetPublishingHouseQuery({ id: data?.publishing_house || 1, short: true }, { skip: !isSuccess });

    useShowError({
        isError: genresStatus.isError || authorsStatus.isError || publishingHousesStatus.isError,
        error: genresStatus.error || authorsStatus.error || publishingHousesStatus.error
    })

    useShowError({
        isError, error
    });

    useShowError({
        isError: deleteBookDescriptionStatus.isError,
        error: deleteBookDescriptionStatus.error
    });

    useEffect(() => {
        if (!deleteBookDescriptionStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Описание книги успешно удалено",
            variant: "success",
        })
        navigate(`/book-descriptions`)
    }, [deleteBookDescriptionStatus]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_bookdescription") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_bookdescription") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/book-descriptions")}>К описанию книг</Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/book-descriptions/${bookDescriptionId}/update`)}>Обновить</Button>}
                {shouldShowDelete && <Button onClick={() => setDeleteOpen(true)}>Удалить</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent sx={{ minHeight: 150 }}>
                <Box sx={{ float: "left", mr: 1 }} aria-label="recipe">
                    {data.icon ? <Box
                        sx={{
                            borderRadius: 1,
                            width: 150
                        }}
                        component="img"
                        src={`${ENV_API_SERVER}/api/files/${data.icon}/`} /> :
                        <NoPhotographyIcon sx={{
                            width: 150,
                            height: 150
                        }} />}
                </Box>
                <Typography variant="h4">{data.name}</Typography>
                <Typography sx={{ mb: 1, display: "block" }} variant="caption">ISBN: {data.isbn}</Typography>
                <Typography sx={{ mb: 1 }} variant="h6">Автор: {authorsStatus.isError || authorsStatus.isSuccess && !dataAuthors?.results?.length ?
                    "Нет автора" :
                    dataAuthors?.results?.map?.((item) =>
                        <Chip
                            onClick={() => {
                                navigate(`/authors/${item.id}`);
                            }}
                            sx={{ mr: 1 }}
                            label={`${item.surname} ${item.name} ${item.patronymics}`} />)}
                </Typography>

                <Typography sx={{ mb: 1 }} variant="h6">Жанры: {genresStatus.isError || genresStatus.isSuccess && !dataGenres?.results?.length ?
                    "Нет жанров" :
                    dataGenres?.results?.map?.((item) =>
                        <Chip
                            onClick={() => {
                                navigate(`/genres/${item.id}`);
                            }}
                            sx={{ mr: 1 }}
                            label={item.name} />)}
                </Typography>

                <Typography sx={{ mb: 1 }} variant="h6">Издательство: {publishingHousesStatus.isError ?
                    "Нет издательства" :
                    <Chip
                        onClick={() => {
                            navigate(`/publishing-houses/${publishingHouses.id}`);
                        }}
                        sx={{ mr: 1 }}
                        label={publishingHouses?.name} />}
                </Typography>
                <Typography variant="body1">{(data as BookDescription)?.description}</Typography>
            </CardContent>
            <CardContent>
            </CardContent>
        </Card> : null}
        <Typography variant="h4" sx={{ alignSelf: "start" }}>Книги:</Typography>
        <BookListPage />
        <ConfirmationDialog
            id="book-description-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить описание книги, оно пропадёт из книг."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deleteBookDescription({ id: bookDescriptionId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}