import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetBookDescriptionListQuery, useGetCSRFQuery, useGetGenreQuery, useUpdateGenreMutation } from "../../../redux/api/baseApi";
import { Backdrop, Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { Genre, GenreListQuery } from "../../../redux/types/genre";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

export function GenreUpdatePage() {
    const { genreId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { data, isError, error, isLoading, isSuccess } = useGetGenreQuery({ id: genreId, short: false });
    const [updateGenre, updateGenreStatus] = useUpdateGenreMutation();

    const methods = useForm({ mode: "onChange" });
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        trigger,
        reset
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSave = (data) => {
        updateGenre({ ...data, id: genreId, csrfmiddlewaretoken: csrfData?.csrf });
    }

    useEffect(() => {
        if (!updateGenreStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Жанр успешно обновлён",
            variant: "success",
        })
        navigate(`/genres/${genreId}/`)

    }, [updateGenreStatus]);

    useEffect(() => {
        setValue("name", data?.name);
        setValue("description", (data as Genre)?.description);
    }, [isSuccess])

    useShowError({
        isError,
        error
    });

    useShowError({
        isError: updateGenreStatus.isError,
        error: updateGenreStatus.error,
        formMethods: methods
    });

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent>
                <FormProvider {...methods}>
                    <Stack spacing={2}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    disabled={isLoading && isSuccess}
                                    label="Название"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.name?.message ?? ""}`}
                                    error={!!errors?.name} />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    disabled={isLoading && isSuccess}
                                    label="Описание"
                                    multiline
                                    rows={10}
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.description?.message ?? ""}`}
                                    error={!!errors?.description} />
                            )}
                        />
                    </Stack>

                </FormProvider>
            </CardContent>
            <CardActions>
                <Button onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card> : null}
    </Container>
}