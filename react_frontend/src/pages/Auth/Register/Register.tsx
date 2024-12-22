import { Button, InputAdornment, TextField } from "@mui/material";
import { AuthWrapper } from "../shared/AuthWrapper";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useGetCSRFQuery, useSignupUserMutation } from "../../../redux/api/baseApi";
import { useShowError } from "hooks/ShowError";
import { LC_AUTH_CALLBACK } from "routes/RouteHeader";

export const NAME_PATTERN = /^[А-Яа-яЁёA-Za-z-]*$/
export const PASSPORT_PATTERN = /^[0-9]{10}$/
export const PHONE_PATTERN = /^\d{10}$/
export const EMAIL_PATTERN = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
export const PASSWORD_PATTERN = /^.{6,}$/

export function RegisterPage() {
    const navigate = useNavigate();
    const methods = useForm<{
        name: string,
        surname: string,
        patronymics: string,
        email: string,
        phone_number: string,
        password1: string,
        password2: string
        passport_data: string,
    }>();

    const {
        control,
        formState: { errors },
        getValues,
        handleSubmit
    } = methods;

    const {
        data: csrfData,
        isSuccess: csrfIsSuccess
    } = useGetCSRFQuery({});

    const [signup, signupStatus] = useSignupUserMutation();

    useEffect(() => {
        if (!localStorage.getItem(LC_AUTH_CALLBACK)) {
            localStorage.setItem(LC_AUTH_CALLBACK, `${window.location.origin}/home`);
        }
    }, []);

    const onSave = (data) => {
        signup({
            ...data,
            csrfmiddlewaretoken: csrfData.csrf
        });
    }

    useShowError({
        isError: signupStatus.isError,
        error: signupStatus.error,
        formMethods: methods
    })

    useEffect(() => {
        if (!signupStatus.isSuccess) return;
        navigate(localStorage.getItem(LC_AUTH_CALLBACK));
    }, [signupStatus]);

    return <AuthWrapper title="Регистрация" actions={<>
        <Button onClick={() => handleSubmit(onSave)()} variant="contained">Зарегистрироваться</Button>
        <Button onClick={() => navigate("/login")}>Войти</Button>
    </>}>
        <FormProvider {...methods}>
            <Controller
                name="surname"
                control={control}
                rules={{
                    required: "Фамилия обязательна",
                    maxLength: {
                        value: 50,
                        message: "Слишком длинное значение"
                    },
                    pattern: {
                        value: NAME_PATTERN,
                        message: "Поле может содержать только кириллические, латинские символы и символ дефиса"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="surname"
                        label="Фамилия"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.surname}
                        helperText={`${errors?.surname?.message || ""}`}
                        required />
                )} />
            <Controller
                name="name"
                control={control}
                rules={{
                    required: "Имя обязательно",
                    maxLength: {
                        value: 50,
                        message: "Слишком длиннное значение"
                    },
                    pattern: {
                        value: NAME_PATTERN,
                        message: "Поле может содержать только кириллические, латинские символы и символ дефиса"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="name"
                        label="Имя"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.name}
                        helperText={`${errors?.name?.message || ""}`}
                        required />
                )} />
            <Controller
                name="patronymics"
                control={control}
                rules={{
                    maxLength: {
                        value: 50,
                        message: "Слишком длиннное значение"
                    },
                    pattern: {
                        value: NAME_PATTERN,
                        message: "Поле может содержать только кириллические, латинские символы и символ дефиса"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="patronymics"
                        label="Отчество"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.patronymics}
                        helperText={`${errors?.patronymics?.message || ""}`}
                        required />
                )} />
            <Controller
                name="passport_data"
                control={control}
                rules={{
                    required: "Паспортные данные обязательны",
                    pattern: {
                        value: PASSPORT_PATTERN,
                        message: "Введите серию и номер паспорта в формате 0123456789, где 0123 - серия паспорта, 456789 - номер паспорта"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="passport_data"
                        label="Серия и номер паспорта"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.passport_data}
                        helperText={`${errors?.passport_data?.message || ""}`}
                        required />
                )} />
            <Controller
                name="phone_number"
                control={control}
                rules={{
                    required: "Номер телефона обязателен",
                    pattern: {
                        value: PHONE_PATTERN,
                        message: "Номер телефона некорректный"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="phone_number"
                        label="Телефон"
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                            },
                        }}
                        ref={ref}
                        type="tel"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.phone_number}
                        helperText={`${errors?.phone_number?.message || ""}`}
                        required />
                )} />
            <Controller
                name="email"
                control={control}
                rules={{
                    required: "Почта обязательна",
                    pattern: {
                        value: EMAIL_PATTERN,
                        message: "Почта некорректна"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="email"
                        label="Почта"
                        ref={ref}
                        type="email"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.email}
                        helperText={`${errors?.email?.message || ""}`}
                        required />
                )} />
            <Controller
                name="password1"
                control={control}
                rules={{
                    pattern: {
                        value: PASSWORD_PATTERN,
                        message: "Длина пароля должна быть больше 6 символов"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="password1"
                        label="Пароль"
                        ref={ref}
                        type="password"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.password1}
                        helperText={`${errors?.password1?.message || ""}`}
                        required />
                )} />
            <Controller
                name="password2"
                control={control}
                rules={{
                    validate: () => {
                        const values = getValues(["password1", "password2"]);
                        if (values[0] !== values[1]) return "Пароли не совпадают";
                        return null;
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="password2"
                        label="Потверждение пароля"
                        ref={ref}
                        type="password"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.password2}
                        helperText={`${errors?.password2?.message || "Повторите выше введённый пароль"}`}
                        required />
                )} />
        </FormProvider>
    </AuthWrapper>
}