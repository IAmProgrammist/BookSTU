import React, { useEffect, useState } from "react";
import { useCreateBookDescriptionMutation, useCreateFileMutation, useGetAuthorListQuery, useGetCSRFQuery, useGetGenreListQuery, useGetPublishingHouseListQuery } from "../../../redux/api/baseApi";
import { Autocomplete, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { VisuallyHiddenInput } from "components/VisuallyHiddenInput";
import { useDebounce } from "hooks/useDebounce";

export function BookDescriptionCreatePage() {
    const [genresSelected, setGenresSelected] = useState([]);
    const [genreLocalStr, setGenreLocalStr] = useState({ val: "", byUser: true });
    const debouncedGenreLocalStr = useDebounce(genreLocalStr);
    const { data: genresData, isLoading: genresIsLoading } = useGetGenreListQuery({
        q: debouncedGenreLocalStr.val,
        short: true,
        size: 15
    });
    const mergedGenresOptions = genresSelected.concat((genresData?.results || []).filter((item) =>
        !genresSelected.some((item1) => item1.id === item.id)
    ));

    const [authorsSelected, setAuthorsSelected] = useState([]);
    const [authorLocalStr, setAuthorLocalStr] = useState({ val: "", byUser: true });
    const debouncedAuthorLocalStr = useDebounce(authorLocalStr);
    const { data: authorsData, isLoading: authorsIsLoading } = useGetAuthorListQuery({
        q: debouncedAuthorLocalStr.val,
        short: true,
        size: 15
    });
    const mergedAuthorsOptions = authorsSelected.concat((authorsData?.results || []).filter((item) =>
        !authorsSelected.some((item1) => item1.id === item.id)
    ));

    const [publishingHousesSelected, setPublishingHousesSelected] = useState([]);
    const [publishingHouseLocalStr, setPublishingHouseLocalStr] = useState({ val: "", byUser: true });
    const debouncedPublishingHouseLocalStr = useDebounce(publishingHouseLocalStr);
    const { data: publishingHousesData, isLoading: publishingHousesIsLoading } = useGetPublishingHouseListQuery({
        q: debouncedPublishingHouseLocalStr.val,
        short: true,
        size: 15
    });
    const mergedPublishingHousesOptions = publishingHousesSelected.concat((publishingHousesData?.results || []).filter((item) =>
        !publishingHousesSelected.some((item1) => item1.id === item.id)
    ));

    const { data: csrfData } = useGetCSRFQuery({});
    const [createBookDescription, createBookDescriptionStatus] = useCreateBookDescriptionMutation();

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
        createBookDescription({
            ...data,
            csrfmiddlewaretoken: csrfData?.csrf,
            genres: genresSelected.map((item) => item.id),
            authors: authorsSelected.map((item) => item.id),
            publishing_house: publishingHousesSelected?.[0]?.id
        });
    }

    useEffect(() => {
        if (!createBookDescriptionStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Описание книги успешно добавлено",
            variant: "success",
        })
        navigate(`/book-descriptions/${createBookDescriptionStatus.data.id}/`)

    }, [createBookDescriptionStatus?.isSuccess]);

    useShowError({
        isError: createBookDescriptionStatus.isError,
        error: createBookDescriptionStatus.error,
        formMethods: methods
    });

    const [uploadFile, uploadFileStatus] = useCreateFileMutation();

    useEffect(() => {
        if (!uploadFileStatus.isSuccess) return;

        setValue("icon", uploadFileStatus.data.id);
    }, [uploadFileStatus?.isSuccess]);

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.add_bookdescription") === -1) {
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
                                            title="Фото книги"
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
                                                            if (event.target.files.length === 0) return;

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
                            name="name"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    id="name"
                                    ref={ref}
                                    disabled={createBookDescriptionStatus.isLoading}
                                    label="Название"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.name?.message ?? ""}`}
                                    error={!!errors?.name} />
                            )}
                        />

                        <Controller
                            name="isbn"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    id="isbn"
                                    ref={ref}
                                    disabled={createBookDescriptionStatus.isLoading}
                                    label="ISBN"
                                    sx={{ width: "100%" }}
                                    value={value}
                                    onChange={onChange}
                                    helperText={`${errors?.isbn?.message ?? ""}`}
                                    error={!!errors?.isbn} />
                            )}
                        />
                        <Controller
                            name="genres"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <Autocomplete
                                    multiple
                                    id="genres"
                                    filterOptions={(x) => x}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={mergedGenresOptions}
                                    loading={genresIsLoading}
                                    value={genresSelected}
                                    loadingText="Загрузка..."
                                    noOptionsText="Не найдено"
                                    inputValue={genreLocalStr.val}
                                    onInputChange={(_ev, value) => setGenreLocalStr({ val: value, byUser: true })}
                                    onChange={(_ev, value: any[]) => {
                                        onChange(value);
                                        setGenresSelected(value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Жанры"
                                            helperText={`${errors?.genres?.message ?? ""}`}
                                            error={!!errors?.genres} 
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {genresIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />)} />

                        <Controller
                            name="authors"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <Autocomplete
                                    multiple
                                    id="authors"
                                    filterOptions={(x) => x}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => `${option.surname} ${option.name} ${option.patronymics}`}
                                    options={mergedAuthorsOptions}
                                    loading={authorsIsLoading}
                                    value={authorsSelected}
                                    loadingText="Загрузка..."
                                    noOptionsText="Не найдено"
                                    inputValue={authorLocalStr.val}
                                    onInputChange={(_ev, value) => setAuthorLocalStr({ val: value, byUser: true })}
                                    onChange={(_ev, value: any[]) => {
                                        onChange(value);
                                        setAuthorsSelected(value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Авторы"
                                            helperText={`${errors?.authors?.message ?? ""}`}
                                            error={!!errors?.authors} 
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {authorsIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />)} />


                        <Controller
                            name="publishing_house"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <Autocomplete
                                    multiple
                                    id="publishingHouses"
                                    filterOptions={(x) => x}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => option.name}
                                    options={mergedPublishingHousesOptions}
                                    loading={publishingHousesIsLoading}
                                    value={publishingHousesSelected}
                                    loadingText="Загрузка..."
                                    noOptionsText="Не найдено"
                                    inputValue={publishingHouseLocalStr.val}
                                    onInputChange={(_ev, value) => setPublishingHouseLocalStr({ val: value, byUser: true })}
                                    onChange={(_ev, value: any[]) => {
                                        onChange(value);
                                        setPublishingHousesSelected(value.length >= 2 ? [value[1]] :
                                            value.length >= 1 ? [value[0]] : []);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Издательство"
                                            helperText={`${errors?.publishing_house?.message ?? ""}`}
                                            error={!!errors?.publishing_house} 
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {publishingHousesIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />)} />

                        <Controller
                            name="description"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <TextField
                                    ref={ref}
                                    disabled={createBookDescriptionStatus.isLoading}
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
                <Button disabled={createBookDescriptionStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={createBookDescriptionStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card>
    </Container>
}