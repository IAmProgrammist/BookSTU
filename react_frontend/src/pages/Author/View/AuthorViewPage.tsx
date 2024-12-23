import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteAuthorMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetAuthorQuery } from "../../../redux/api/baseApi";
import { Avatar, Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Author } from "../../../redux/types/author";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { SP_ROOT } from "hooks/SearchParamsFilter";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function AuthorViewPage() {
    const { authorId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteAuthor, deleteAuthorStatus] = useDeleteAuthorMutation();
    const { data, isError, error, isLoading, isSuccess } = useGetAuthorQuery({ id: authorId, short: false });
    const { data: booksData, isError: booksIsError, error: booksError, isLoading: booksIsLoading, isSuccess: booksIsSuccess } = useGetBookDescriptionListQuery({
        size: 3,
        authors: [authorId]
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
        isError: deleteAuthorStatus.isError,
        error: deleteAuthorStatus.error
    });

    useEffect(() => {
        if (!deleteAuthorStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Автор успешно удалён",
            variant: "success",
        })
        navigate(`/authors`)
    }, [deleteAuthorStatus]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_author") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_author") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const {description = "", ...shortAuthor} = (data as Author) || {};

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate("/authors")}>К списку авторов</Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/authors/${authorId}/update`)}>Обновить</Button>}
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
                <Typography variant="h4">{data.surname} {data.name} {data.patronymics}</Typography>
                <Typography variant="body1">{(data as Author)?.description}</Typography>
            </CardContent>
            <CardContent>
            </CardContent>
        </Card> : null}
        <Typography sx={{ alignSelf: "start" }} variant="h4">{!!booksData?.results?.length ? "Книги от автора:" : ""}</Typography>
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 300px));",
            gap: 2,
            width: "100%",
            my: 4
        }}>
            {!!booksData?.results?.length && booksData.results.map((item) => <Card variant="outlined" key={item.id}>
                <CardActionArea onClick={() => navigate(`/book-descriptions/${item.id}`)}>
                    <CardHeader title={item.name} subheader={`ISBN: ${item.isbn}`} />
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
                </CardActionArea>
            </Card>)}
        </Box>
        {!!booksData?.results?.length ? <Link href={`/book-descriptions?${SP_ROOT}=${encodeURIComponent(JSON.stringify({authors: [shortAuthor]}))}`}>Мне нужно больше книг!</Link> : null}
        <ConfirmationDialog
            id="author-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить автора, он будет также удалён из списка авторов книг."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deleteAuthor({ id: authorId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}