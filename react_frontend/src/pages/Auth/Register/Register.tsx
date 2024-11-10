import { Button, TextField } from "@mui/material";
import { AuthWrapper } from "../shared/AuthWrapper";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";

const NAME_PATTERN = /^[А-Яа-яЁёA-Za-z-]*$/
const PASSPORT_PATTERN = /^[0-9]{10}$/
const PHONE_PATTERN = /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/
const EMAIL_PATTERN = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
const PASSWORD_PATTERN = /^.{6,}$/

export function RegisterPage() {
    const navigate = useNavigate();
    const methods = useForm<{
        name: string,
        surname: string,
        patronymic: string,
        passportData: string,
        phone: string,
        email: string,
        password: string,
        confirmPassword: string
    }>();
    const {
        control,
        formState: { errors },
        getValues,
        trigger
    } = methods;

    return <AuthWrapper title="Регистрация" actions={<>
        <Button onClick={() => trigger()} variant="contained">Зарегистрироваться</Button>
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
                name="patronymic"
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
                        label="Отчество"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.patronymic}
                        helperText={`${errors?.patronymic?.message || ""}`}
                        required />
                )} />
            <Controller
                name="passportData"
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
                        label="Серия и номер паспорта"
                        ref={ref}
                        type="text"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.passportData}
                        helperText={`${errors?.passportData?.message || ""}`}
                        required />
                )} />
            <Controller
                name="phone"
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
                        label="Телефон"
                        ref={ref}
                        type="tel"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.phone}
                        helperText={`${errors?.phone?.message || ""}`}
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
                name="password"
                control={control}
                rules={{
                    pattern: {
                        value: PASSWORD_PATTERN,
                        message: "Длина пароля должна быть больше 6 символов"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        label="Пароль"
                        ref={ref}
                        type="password"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.password}
                        helperText={`${errors?.password?.message || ""}`}
                        required />
                )} />
            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                    validate: () => {
                        const values = getValues(["password", "confirmPassword"]);
                        if (values[0] !== values[1]) return "Пароли не совпадают";
                        return null;
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        label="Потверждение пароля"
                        ref={ref}
                        type="password"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.confirmPassword}
                        helperText={`${errors?.confirmPassword?.message || "Повторите выше введённый пароль"}`}
                        required />
                )} />
        </FormProvider>
    </AuthWrapper>
}