import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCSRFQuery, useGetBookQuery, useUpdateBookMutation, useGetBookDescriptionQuery } from "../../../redux/api/baseApi";
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Book, BookState } from "../../../redux/types/book";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { BOOK_STATE_NAMES } from "dicts";

export function BookUpdatePage() {
    const { bookId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { data, isError, error, isLoading, isSuccess } = useGetBookQuery({ id: bookId });
    const [updateBook, updateBookStatus] = useUpdateBookMutation();

    const {
        data: bookDescriptionData,
        ...bookDescriptionStatus
    } = useGetBookDescriptionQuery({ id: data?.description, short: true }, { skip: !data?.description });

    useShowError({
        isError: bookDescriptionStatus.isError,
        error: bookDescriptionStatus.error,
    })

    const methods = useForm({ mode: "onChange" });
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSave = (saveData) => {
        updateBook({
            ...saveData,
            description: data.description,
            id: bookId,
            csrfmiddlewaretoken: csrfData?.csrf
        });
    }

    useEffect(() => {
        if (!updateBookStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Книга успешно обновлена",
            variant: "success",
        })
        navigate(`/books/${bookId}/`)

    }, [updateBookStatus]);

    useEffect(() => {
        setValue("inventory_number", data?.inventory_number);
        setValue("state", data?.state);
    }, [isSuccess])

    useShowError({
        isError,
        error
    });

    useShowError({
        isError: updateBookStatus.isError,
        error: updateBookStatus.error,
        formMethods: methods
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.change_book") === -1) {
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
                        <Card variant="outlined">
                            <CardHeader
                                title={bookDescriptionStatus.isLoading ? "Загрузка..." : bookDescriptionData.name}
                                subheader={bookDescriptionStatus.isLoading ? "" : `ISBN: ${bookDescriptionData.isbn}`} />
                        </Card>
                        <Controller
                            name="inventory_number"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    ref={ref}
                                    disabled={isLoading || bookDescriptionStatus.isLoading || updateBookStatus.isLoading}
                                    label="Инвентарный номер"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.inventory_number?.message ?? ""}`}
                                    error={!!errors?.inventory_number} />
                            )}
                        />

                        <Controller
                            name="state"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <FormControl>
                                    <InputLabel error={!!errors?.state} id="state">Состояние</InputLabel>
                                    <Select
                                        ref={ref}
                                        disabled={isLoading || bookDescriptionStatus.isLoading || updateBookStatus.isLoading}
                                        labelId="state"
                                        id="state"
                                        value={value}
                                        label="Состояние"
                                        error={!!errors?.state}
                                        onChange={(event) => {
                                            onChange(event.target.value);
                                        }}
                                    >
                                        {Object.values(BookState).map((item) => <MenuItem value={item}>{BOOK_STATE_NAMES[item]}</MenuItem>)}
                                    </Select>
                                    {!!errors?.state ? <FormHelperText error={!!errors?.state}>{`${errors?.state?.message ?? ""}`}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </Stack>

                </FormProvider>
            </CardContent>
            <CardActions>
                <Button disabled={isLoading || bookDescriptionStatus.isLoading || updateBookStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={isLoading || bookDescriptionStatus.isLoading || updateBookStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card> : null}
    </Container>
}