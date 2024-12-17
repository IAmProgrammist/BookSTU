import React, { useEffect } from "react";
import { AuthWrapper } from "../shared/AuthWrapper";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LC_AUTH_CALLBACK } from "routes/RouteHeader";

export function LoginPage() {
    const navigate = useNavigate();
    const methods = useForm<{
        loginemail: string,
        password: string
    }>();
    const {
        control,
        formState: { errors }
    } = methods;

    useEffect(() => {
        if (!localStorage.getItem(LC_AUTH_CALLBACK)) {
            localStorage.setItem(LC_AUTH_CALLBACK, `${window.location.origin}/home`);
        }
    }, []);

    return <AuthWrapper title="Вход" actions={<>
        <Button onClick={() => localStorage.getItem(LC_AUTH_CALLBACK)} variant="contained">Войти</Button>
        <Button onClick={() => navigate("/register")}>Зарегистрироваться</Button>
    </>}>
        <FormProvider {...methods}>
            <Controller
                name="loginemail"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        label="Почта или номер телефона"
                        ref={ref}
                        type="email"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.loginemail}
                        helperText={`${errors?.loginemail?.message || ""}`}
                        required />
                )} />
            <Controller
                name="password"
                control={control}
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
        </FormProvider>
    </AuthWrapper>
}