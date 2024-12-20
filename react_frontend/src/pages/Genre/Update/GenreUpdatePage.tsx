import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCSRFQuery, useGetGenreQuery, useUpdateGenreMutation } from "../../../redux/api/baseApi";
import { Button, Card, CardActions, CardContent, CircularProgress, Container, Stack, TextField } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Genre } from "../../../redux/types/genre";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";

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

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.change_genre") === -1) {
                enqueueSnackbar({
                    message: "Недостаточно прав",
                    variant: "error",
                })
                navigate("/");
            }
        }
    }, [permissionsIsSuccess]);

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
                                    ref={ref}
                                    disabled={isLoading && isSuccess || updateGenreStatus.isLoading}
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
                                    ref={ref}
                                    disabled={isLoading && isSuccess || updateGenreStatus.isLoading}
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
                <Button disabled={isLoading && isSuccess || updateGenreStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={isLoading && isSuccess || updateGenreStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card> : null}
    </Container>
}