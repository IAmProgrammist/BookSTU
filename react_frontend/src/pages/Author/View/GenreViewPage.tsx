import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteGenreMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetGenreQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Genre } from "../../../redux/types/genre";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";

export function GenreViewPage() {
    const { genreId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteGenre, deleteGenreStatus] = useDeleteGenreMutation();
    const { data, isError, error, isLoading, isSuccess } = useGetGenreQuery({ id: genreId, short: false });
    const { data: booksData, isError: booksIsError, error: booksError, isLoading: booksIsLoading, isSuccess: booksIsSuccess } = useGetBookDescriptionListQuery({
        size: 5,
        genres: [genreId]
    });
    const navigate = useNavigate();

    useShowError({
        isError, error
    });

    useShowError({
        isError: booksIsError,
        error: booksError
    });

    useShowError({
        isError: deleteGenreStatus.isError,
        error: deleteGenreStatus.error
    });

    useEffect(() => {
        if (!deleteGenreStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Жанр успешно удалён",
            variant: "success",
        })
        navigate(`/genres`)
    }, [deleteGenreStatus]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_genre") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_genre") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/genres/${genreId}/update`)}>Обновить</Button>}
                {shouldShowDelete && <Button onClick={() => setDeleteOpen(true)}>Удалить</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h4">{data.name}</Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body1">{(data as Genre)?.description}</Typography>
            </CardContent>
        </Card> : null}
        <Typography sx={{ alignSelf: "start" }} variant="h4">Книги в этом жанре:</Typography>
        <ConfirmationDialog
            id="genre-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить жанр, он будет также удалён из списка жанров книг."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deleteGenre({ id: genreId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}