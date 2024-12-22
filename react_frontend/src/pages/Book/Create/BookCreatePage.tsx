import React, { useEffect } from "react";
import { useCreateBookMutation, useGetBookDescriptionQuery, useGetCSRFQuery } from "../../../redux/api/baseApi";
import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { BookState } from "../../../redux/types/book";
import { BOOK_STATE_NAMES } from "dicts";

export function BookCreatePage() {
    const { bookDescriptionId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const [createBook, createBookStatus] = useCreateBookMutation();

    const {
        data: bookDescriptionData,
        ...bookDescriptionStatus
    } = useGetBookDescriptionQuery({ id: bookDescriptionId, short: true });

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
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSave = (data) => {
        createBook({
            ...data,
            description: bookDescriptionId,
            csrfmiddlewaretoken: csrfData?.csrf
        });
    }

    useEffect(() => {
        if (!createBookStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Книга успешно добавлена",
            variant: "success",
        })
        navigate(`/books/${createBookStatus.data.id}`)

    }, [createBookStatus]);

    useShowError({
        isError: createBookStatus.isError,
        error: createBookStatus.error,
        formMethods: methods
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.add_book") === -1) {
                enqueueSnackbar({
                    message: "Недостаточно прав",
                    variant: "error",
                })
                navigate("/");
            }
        }
    }, [permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Card sx={{ width: "100%" }}>
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
                                    disabled={createBookStatus.isLoading || bookDescriptionStatus.isLoading}
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
                                        disabled={createBookStatus.isLoading || bookDescriptionStatus.isLoading}
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
                <Button disabled={createBookStatus.isLoading || bookDescriptionStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={createBookStatus.isLoading || bookDescriptionStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card>
    </Container>
}