import React from "react";
import { AuthWrapper } from "../shared/AuthWrapper";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const navigate = useNavigate();

    return <AuthWrapper title="Вход" actions={<>
        <Button onClick={() => navigate("/home")} variant="contained">Войти</Button>
        <Button onClick={() => navigate("/register")}>Зарегистрироваться</Button>
    </>}>
        <TextField label="Почта или номер телефона" type="email" />
        <TextField label="Пароль" type="password" />
    </AuthWrapper>
}