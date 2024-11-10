import { Button, TextField } from "@mui/material";
import { AuthWrapper } from "../shared/AuthWrapper";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";

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
                        value: /[^А-Яа-яЁёA-Za-z-]/,
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
                        value: /[^А-Яа-яЁёA-Za-z-]/,
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
                        value: /[А-Яа-яЁёA-Za-z-]/,
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
                        value: /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/,
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
                    required: "Почта обязательна",
                    pattern: {
                        value: /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/,
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
                        value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
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
                name="patronymic"
                control={control}
                rules={{
                    maxLength: {
                        value: 50,
                        message: "Слишком длиннное значение"
                    },
                    pattern: {
                        value: /[^А-Яа-яЁёA-Za-z-]/,
                        message: "Поле может содержать только кириллические, латинские символы и символ дефиса"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField label="Пароль" type="password" required />
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
                        value: /[^А-Яа-яЁёA-Za-z-]/,
                        message: "Поле может содержать только кириллические, латинские символы и символ дефиса"
                    }
                }}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField label="Подтверждение пароля" type="password" required />
                )} />
        </FormProvider>
    </AuthWrapper>
}