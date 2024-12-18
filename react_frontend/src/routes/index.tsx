import { Typography } from "@mui/material";
import { Navigate, Params, useRoutes } from "react-router-dom";
import { LoginPage } from "../pages/Auth/Login";
import { RegisterPage } from "../pages/Auth/Register/Register";
import React from "react";
import { RouteHeader } from "./RouteHeader";

export const TITLE_MAP: { [key in string]: (params: Params<string>) => string } = {
    "/home": () => "Домашняя страница",
    "/protected-route": () => "Защищённая страница",
}

function Adads() {
    return <Typography>This is home!</Typography>;
}

export function AppRoutes() {
    const routes = useRoutes([
        { path: '/', element: <Navigate to='/home' replace /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        {
            path: '/',
            element: <RouteHeader isProtected />,
            children: [
                { path: '/protected-route', element: <Typography>This protected home!</Typography> },
            ]
        },
        {
            path: '/',
            element: <RouteHeader isProtected={false} />,
            children: [
                { path: '/home', element: <Adads /> }
            ]
        },
        { path: '*', element: <Navigate to='/home' replace /> }
    ]);

    return <>{routes}</>;
}