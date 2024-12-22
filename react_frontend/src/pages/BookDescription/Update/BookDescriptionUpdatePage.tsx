import React, { useEffect, useState } from "react";
import {
    useCreateFileMutation,
    useGetAuthorListQuery,
    useGetBookDescriptionQuery,
    useGetCSRFQuery,
    useGetGenreListQuery,
    useGetPublishingHouseListQuery,
    useGetPublishingHouseQuery,
    useUpdateBookDescriptionMutation
} from "../../../redux/api/baseApi";
import { Autocomplete, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { VisuallyHiddenInput } from "components/VisuallyHiddenInput";
import { useDebounce } from "hooks/useDebounce";
import { BookDescription } from "../../../redux/types/bookDescription";
import { Whoops } from "components/Whoops";

export function BookDescriptionUpdatePage() {
    const { bookDescriptionId } = useParams();

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
    const [updateBookDescription, updateBookDescriptionStatus] = useUpdateBookDescriptionMutation();

    const { data, isError, error, isLoading, isSuccess } = useGetBookDescriptionQuery({ id: bookDescriptionId, short: false });

    useShowError({
        isError, error
    })

    const { data: dataAuthors, ...authorsStatus } = useGetAuthorListQuery({ id: data?.authors?.length ? data?.authors : [0], size: 50, short: true }, { skip: !isSuccess });
    const { data: dataGenres, ...genresStatus } = useGetGenreListQuery({ id: data?.genres?.length ? data?.genres : [0], size: 50, short: true }, { skip: !isSuccess });
    const { data: publishingHouses, ...publishingHousesStatus } = useGetPublishingHouseQuery({ id: data?.publishing_house || 0, short: true }, { skip: !isSuccess });

    useEffect(() => {
        setValue("icon", data?.icon || "");
        setValue("name", data?.name);
        setValue("isbn", data?.isbn);
        setValue("description", (data as BookDescription)?.description);
    }, [isSuccess]);

    useEffect(() => {
        if (!authorsStatus.isSuccess) return;
        setAuthorsSelected(dataAuthors.results);
    }, [authorsStatus?.isSuccess]);

    useEffect(() => {
        if (!genresStatus.isSuccess) return;
        setGenresSelected(dataGenres.results);
    }, [genresStatus?.isSuccess])

    useEffect(() => {
        if (!publishingHousesStatus.isSuccess) return;
        setPublishingHousesSelected([publishingHouses]);
    }, [publishingHousesStatus?.isSuccess])

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
        updateBookDescription({
            ...data,
            id: bookDescriptionId,
            csrfmiddlewaretoken: csrfData?.csrf,
            genres: genresSelected.map((item) => item.id),
            authors: authorsSelected.map((item) => item.id),
            publishing_house: publishingHousesSelected?.[0]?.id
        });
    }

    useEffect(() => {
        if (!updateBookDescriptionStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Книга успешно обновлена",
            variant: "success",
        })
        navigate(`/book-descriptions/${bookDescriptionId}/`)

    }, [updateBookDescriptionStatus?.isSuccess]);

    useShowError({
        isError: updateBookDescriptionStatus.isError,
        error: updateBookDescriptionStatus.error,
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
            if (permissions.findIndex((item) => item === "django_backend.change_bookdescription") === -1) {
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
                                                    disabled={uploadFileStatus.isLoading || isLoading || updateBookDescriptionStatus.isLoading}
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
                                                <Button
                                                    disabled={uploadFileStatus.isLoading || isLoading || updateBookDescriptionStatus.isLoading}
                                                    onClick={() => onChange("")}>Очистить</Button></>
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
                                    disabled={isLoading || updateBookDescriptionStatus.isLoading}
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
                                    disabled={isLoading || updateBookDescriptionStatus.isLoading}
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
                                    loading={genresIsLoading || isLoading || updateBookDescriptionStatus.isLoading || genresStatus.isLoading}
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
                                    loading={authorsIsLoading || isLoading || updateBookDescriptionStatus.isLoading || authorsStatus.isLoading}
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
                                    loading={publishingHousesIsLoading || isLoading || updateBookDescriptionStatus.isLoading || publishingHousesStatus.isLoading}
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
                                    disabled={isLoading}
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
                <Button disabled={isLoading || updateBookDescriptionStatus.isLoading || uploadFileStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={isLoading || updateBookDescriptionStatus.isLoading || uploadFileStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card> : null}
    </Container>
}