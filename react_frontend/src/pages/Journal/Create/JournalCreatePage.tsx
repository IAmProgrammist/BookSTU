import React, { useEffect, useState } from "react";
import { useCreateJournalMutation, useGetBookDescriptionQuery, useGetBookQuery, useGetCSRFQuery, useGetUserListQuery } from "../../../redux/api/baseApi";
import { Autocomplete, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useShowError } from "hooks/ShowError";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { BookState } from "../../../redux/types/book";
import { BOOK_STATE_NAMES } from "dicts";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import { DateTimeField, DesktopDateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDebounce } from "hooks/useDebounce";
import 'dayjs/locale/ru'
import dayjs from "dayjs";

const PAGE_SIZE = 15;

export function JournalCreatePage() {
    const { bookId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const [createJournal, createJournalStatus] = useCreateJournalMutation();

    const {
        data: bookData,
        ...bookStatus
    } = useGetBookQuery({ id: bookId });

    useShowError({
        isError: bookStatus.isError,
        error: bookStatus.error,
    })

    const {
        data: bookDescriptionData,
        ...bookDescriptionStatus
    } = useGetBookDescriptionQuery({ id: bookData?.description, short: true }, { skip: !bookStatus.isSuccess });

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
        createJournal({
            ...data,
            book: bookId,
            user: data?.user?.[0]?.id || "",
            csrfmiddlewaretoken: csrfData?.csrf,
            begin_date: dayjs(data?.begin_date).isValid() ?
                dayjs(data?.begin_date).format("YYYY-MM-DDTHH:mm:ssZ") : "",
            end_date: dayjs(data?.end_date).isValid() ?
                dayjs(data?.end_date).format("YYYY-MM-DDTHH:mm:ssZ") : "",
            returned_date: dayjs(data?.returned_date).isValid() ?
                dayjs(data?.returned_date).format("YYYY-MM-DDTHH:mm:ssZ") : ""
        });
    }

    useEffect(() => {
        if (!createJournalStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Запись успешно добавлена",
            variant: "success",
        })
        navigate(`/journals/${createJournalStatus.data.id}`)

    }, [createJournalStatus]);

    useShowError({
        isError: createJournalStatus.isError,
        error: createJournalStatus.error,
        formMethods: methods
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    useEffect(() => {
        if (permissionsIsSuccess) {
            if (permissions.findIndex((item) => item === "django_backend.add_journal") === -1) {
                enqueueSnackbar({
                    message: "Недостаточно прав",
                    variant: "error",
                })
                navigate("/");
            }
        }
    }, [permissionsIsSuccess]);


    const [usersSelected, setUsersSelected] = useState([]);
    const [publishingHouseLocalStr, setPublishingHouseLocalStr] = useState({ val: "", byUser: true });
    const debouncedPublishingHouseLocalStr = useDebounce(publishingHouseLocalStr);
    const { data: usersData, isLoading: usersIsLoading } = useGetUserListQuery({
        q: debouncedPublishingHouseLocalStr.val,
        size: PAGE_SIZE,
        banned: false
    });
    const mergedUsersOptions = usersSelected.concat((usersData?.results || []).filter((item) =>
        !usersSelected.some((item1) => item1.id === item.id)
    ));

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Card sx={{ width: "100%" }}>
            <CardContent>
                <FormProvider {...methods}>
                    <Stack spacing={2}>
                        <Card variant="outlined">
                            <CardHeader
                                title={<>{bookDescriptionStatus.isSuccess ? bookDescriptionData?.name : "Загрузка..."}</>}
                                subheader={<>{bookDescriptionStatus.isSuccess ? `ISBN: ${bookDescriptionData?.isbn}` : ""}<br />
                                    {bookStatus.isSuccess ? `Инвентарный номер: ${bookData.inventory_number}` : ""}<br />
                                    {bookStatus.isSuccess ? `Состояние: ${BOOK_STATE_NAMES[bookData.state]}` : ""}</>} />
                        </Card>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                            <Controller
                                name="begin_date"
                                control={control}
                                rules={{required: "Дата выдачи обязательна"}}
                                defaultValue={null}
                                render={({ field: { value, onChange, ref } }) => (
                                    <FormControl>
                                        <DesktopDateTimePicker
                                            label="Дата выдачи"
                                            ref={ref}
                                            disabled={createJournalStatus.isLoading || bookDescriptionStatus.isLoading || bookStatus.isLoading}
                                            sx={{ width: "100%" }}
                                            value={value}
                                            onChange={(newValue) => onChange(newValue)}
                                        />
                                        {!!errors?.begin_date ? <FormHelperText error={!!errors?.begin_date}>{`${errors?.begin_date?.message ?? ""}`}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="end_date"
                                rules={{required: "Дата возврата обязательна"}}
                                control={control}
                                defaultValue={null}
                                render={({ field: { value, onChange, ref } }) => (
                                    <FormControl>
                                        <DesktopDateTimePicker
                                            label="Ожидаемая дата возврата"
                                            ref={ref}
                                            disabled={createJournalStatus.isLoading || bookDescriptionStatus.isLoading || bookStatus.isLoading}
                                            sx={{ width: "100%" }}
                                            value={value}
                                            onChange={(newValue) => onChange(newValue)}
                                        />
                                        {!!errors?.end_date ? <FormHelperText error={!!errors?.end_date}>{`${errors?.end_date?.message ?? ""}`}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="returned_date"
                                control={control}
                                defaultValue={null}
                                render={({ field: { value, onChange, ref } }) => (
                                    <FormControl>
                                        <DesktopDateTimePicker
                                            label="Возвращена пользователем"
                                            ref={ref}
                                            disabled={createJournalStatus.isLoading || bookDescriptionStatus.isLoading || bookStatus.isLoading}
                                            sx={{ width: "100%" }}
                                            value={value}
                                            onChange={(newValue) => onChange(newValue)}
                                        />
                                        {!!errors?.returned_date ? <FormHelperText error={!!errors?.returned_date}>{`${errors?.returned_date?.message ?? ""}`}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                        </LocalizationProvider>
                        <Controller
                            name="user"
                            control={control}
                            defaultValue={""}
                            render={({ field: { value, onChange, ref } }) => (
                                <Autocomplete
                                    multiple
                                    id="user"
                                    filterOptions={(x) => x}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => `${option.surname} ${option.name} ${option.patronymics}`}
                                    options={mergedUsersOptions}
                                    loading={usersIsLoading}
                                    value={usersSelected}
                                    loadingText="Загрузка..."
                                    noOptionsText="Не найдено"
                                    inputValue={publishingHouseLocalStr.val}
                                    onInputChange={(_ev, value) => setPublishingHouseLocalStr({ val: value, byUser: true })}
                                    onChange={(_ev, value: any[]) => {
                                        onChange(value);
                                        setUsersSelected(value.length >= 2 ? [value[1]] :
                                            value.length >= 1 ? [value[0]] : []);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Пользователь"
                                            helperText={`${errors?.user?.message ?? ""}`}
                                            error={!!errors?.user}
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {usersIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />)} />
                    </Stack>
                </FormProvider>
            </CardContent>
            <CardActions>
                <Button disabled={createJournalStatus.isLoading || bookDescriptionStatus.isLoading || bookStatus.isLoading} onClick={() => handleSubmit(onSave)()}>Сохранить</Button>
                <Button disabled={createJournalStatus.isLoading || bookDescriptionStatus.isLoading || bookStatus.isLoading} onClick={() => navigate(-1)}>Отмена</Button>
            </CardActions>
        </Card>
    </Container>
}