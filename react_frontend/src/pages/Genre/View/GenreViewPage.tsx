import React from "react";
import { useParams } from "react-router-dom";
import { useGetBookDescriptionListQuery, useGetGenreQuery } from "../../../redux/api/baseApi";
import { Backdrop, Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { Genre, GenreListQuery } from "../../../redux/types/genre";

export function GenreViewPage() {
    const { genreId } = useParams();
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

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Button onClick={() => navigate(`/genres/${genreId}/update`)}>Обновить</Button>
                <Button>Удалить</Button>
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{width: "100%"}}>
            <CardContent>
                <Typography variant="h4">{data.name}</Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body1">{(data as Genre)?.description}</Typography>
            </CardContent>
        </Card> : null}
        <Typography sx={{alignSelf: "start"}} variant="h4">Книги в этом жанре:</Typography>
    </Container>
}