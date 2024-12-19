import React, { useEffect } from "react";
import { useCreatePublishingHouseMutation, useGetCSRFQuery } from "../../../redux/api/baseApi";
import { Button, Card, CardActions, CardContent, Container, Stack, TextField } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";

export function PublishingHouseCreatePage() {
    const { data: csrfData } = useGetCSRFQuery({});
    const [createPublishingHouse, createPublishingHouseStatus] = useCreatePublishingHouseMutation();

    const methods = useForm({ mode: "onChange" });
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = methods;

    const { enqueueSnackbar } = useSnackbar();

    const onSave = (data) => {
        createPublishingHouse({ ...data, csrfmiddlewaretoken: csrfData?.csrf });
    }

    useEffect(() => {
        if (!createPublishingHouseStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Издательство успешно добавлено",
            variant: "success",
        })
        navigate(`/publishing-houses/${createPublishingHouseStatus.data.id}/`)

    }, [createPublishingHouseStatus]);

    useShowError({
        isError: createPublishingHouseStatus.isError,
        error: createPublishingHouseStatus.error,
        formMethods: methods
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.add_publishinghouse") === -1) {
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
                        <Controller
                            name="name"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    ref={ref}
                                    disabled={createPublishingHouseStatus.isLoading}
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
                                    disabled={createPublishingHouseStatus.isLoading}
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
                <Button disabled={createPublishingHouseStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={createPublishingHouseStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card>
    </Container>
}