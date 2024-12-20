import React, { useEffect } from "react";
import { useCreateAuthorMutation, useCreateFileMutation, useGetCSRFQuery } from "../../../redux/api/baseApi";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Stack, TextField, Typography } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { VisuallyHiddenInput } from "components/VisuallyHiddenInput";

export function AuthorCreatePage() {
    const { data: csrfData } = useGetCSRFQuery({});
    const [createAuthor, createAuthorStatus] = useCreateAuthorMutation();

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
        createAuthor({ ...data, csrfmiddlewaretoken: csrfData?.csrf });
    }

    useEffect(() => {
        if (!createAuthorStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Автор успешно добавлен",
            variant: "success",
        })
        navigate(`/authors/${createAuthorStatus.data.id}/`)

    }, [createAuthorStatus]);

    useShowError({
        isError: createAuthorStatus.isError,
        error: createAuthorStatus.error,
        formMethods: methods
    });

    const [uploadFile, uploadFileStatus] = useCreateFileMutation();

    useEffect(() => {
        if (!uploadFileStatus.isSuccess) return;

        setValue("icon", uploadFileStatus.data.id);
    }, [uploadFileStatus]);

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.add_author") === -1) {
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
                            name="icon"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => {
                                return <>
                                    <Card variant="outlined">
                                        <CardHeader
                                            title="Фото автора"
                                            avatar={
                                                <Avatar aria-label="recipe">
                                                    {value ? <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            objectFit: "cover"
                                                        }}
                                                        component="img"
                                                        src={`${ENV_API_SERVER}/api/files/${value}/`} /> :
                                                        <NoPhotographyIcon sx={{
                                                            width: 40,
                                                            height: 40
                                                        }} />}
                                                </Avatar>
                                            }
                                            action={<>
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    disabled={uploadFileStatus.isLoading}
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    {uploadFileStatus.isLoading ? "Идёт загрузка, подождите..." : "Загрузить фото"}
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={(event) => {
                                                            if (event.target.files.length == 0) return;

                                                            uploadFile({
                                                                file: event.target.files[0] as File,
                                                                csrfmiddlewaretoken: csrfData.csrf
                                                            })
                                                        }}
                                                        multiple
                                                    />
                                                </Button>
                                                <Button onClick={() => onChange("")}>Очистить</Button></>
                                            }>
                                        </CardHeader>
                                    </Card>

                                    {!!errors?.icon ? <Typography color="error" variant="caption">{`${errors?.icon?.message}`}</Typography> : null}
                                </>;
                            }}
                        />

                        <Controller
                            name="surname"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    id="surname"
                                    ref={ref}
                                    disabled={createAuthorStatus.isLoading}
                                    label="Фамилия"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.surname?.message ?? ""}`}
                                    error={!!errors?.surname} />
                            )}
                        />

                        <Controller
                            name="name"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    id="name"
                                    ref={ref}
                                    disabled={createAuthorStatus.isLoading}
                                    label="Имя"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.name?.message ?? ""}`}
                                    error={!!errors?.name} />
                            )}
                        />

                        <Controller
                            name="patronymics"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    id="patronymics"
                                    ref={ref}
                                    disabled={createAuthorStatus.isLoading}
                                    label="Отчество"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.patronymics?.message ?? ""}`}
                                    error={!!errors?.patronymics} />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    ref={ref}
                                    disabled={createAuthorStatus.isLoading}
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
                <Button disabled={createAuthorStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={createAuthorStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card>
    </Container>
}