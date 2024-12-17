import React, { useEffect } from "react";
import { AuthWrapper } from "../shared/AuthWrapper";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LC_AUTH_CALLBACK } from "routes/RouteHeader";
import { useGetCSRFQuery, useLoginUserMutation } from "../../../redux/api/baseApi";
import { useShowError } from "hooks/ShowError";

export function LoginPage() {
    const navigate = useNavigate();
    const methods = useForm<{
        login: string,
        password: string
    }>();
    const {
        control,
        formState: { errors },
        handleSubmit
    } = methods;

    const {
        data: csrfData,
        isSuccess: csrfIsSuccess
    } = useGetCSRFQuery({});

    const [login, loginStatus] = useLoginUserMutation();

    useEffect(() => {
        if (!localStorage.getItem(LC_AUTH_CALLBACK)) {
            localStorage.setItem(LC_AUTH_CALLBACK, `${window.location.origin}/home`);
        }
    }, []);

    useEffect(() => {
        if (!loginStatus.isSuccess) return;

        navigate(localStorage.getItem(LC_AUTH_CALLBACK));
    }, [loginStatus]);

    const onSave = (data) => {
        login({
            ...data,
            csrfmiddlewaretoken: csrfData.csrf
        })
    }

    useShowError({
        isError: loginStatus.isError,
        error: loginStatus.error,
        formMethods: methods
    })

    useEffect(() => {
        if (!loginStatus.isSuccess) return;
        navigate(localStorage.getItem(LC_AUTH_CALLBACK));
    }, [loginStatus]);

    return <AuthWrapper title="Вход" actions={<>
        <Button onClick={() => handleSubmit(onSave)()} variant="contained">Войти</Button>
        <Button onClick={() => navigate("/register")}>Зарегистрироваться</Button>
    </>}>
        <FormProvider {...methods}>
            <Controller
                name="login"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="login"
                        label="Почта или номер телефона"
                        ref={ref}
                        type="email"
                        value={value}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(ev.target.value)}
                        error={!!errors?.login}
                        helperText={`${errors?.login?.message || ""}`}
                        required />
                )} />
            <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                    <TextField
                        id="password"
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