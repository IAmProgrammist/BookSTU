import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCSRFQuery, useGetPublishingHouseQuery, useUpdatePublishingHouseMutation } from "../../../redux/api/baseApi";
import { Button, Card, CardActions, CardContent, CircularProgress, Container, Stack, TextField } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { PublishingHouse } from "../../../redux/types/publishingHouse";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

export function PublishingHouseUpdatePage() {
    const { publishingHouseId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { data, isError, error, isLoading, isSuccess } = useGetPublishingHouseQuery({ id: publishingHouseId, short: false });
    const [updatePublishingHouse, updatePublishingHouseStatus] = useUpdatePublishingHouseMutation();

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
        updatePublishingHouse({ ...data, id: publishingHouseId, csrfmiddlewaretoken: csrfData?.csrf });
    }

    useEffect(() => {
        if (!updatePublishingHouseStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Издательство успешно обновлено",
            variant: "success",
        })
        navigate(`/publishing-houses/${publishingHouseId}/`)

    }, [updatePublishingHouseStatus]);

    useEffect(() => {
        setValue("name", data?.name);
        setValue("description", (data as PublishingHouse)?.description);
    }, [isSuccess])

    useShowError({
        isError,
        error
    });

    useShowError({
        isError: updatePublishingHouseStatus.isError,
        error: updatePublishingHouseStatus.error,
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
                                    ref={ref}
                                    disabled={isLoading && isSuccess || updatePublishingHouseStatus.isLoading}
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
                                    disabled={isLoading && isSuccess || updatePublishingHouseStatus.isLoading}
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
                <Button disabled={isLoading && isSuccess || updatePublishingHouseStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={isLoading && isSuccess || updatePublishingHouseStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card> : null}
    </Container>
}