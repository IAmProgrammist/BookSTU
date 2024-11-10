import { Typography } from "@mui/material";
import { Navigate, Params, useRoutes } from "react-router-dom";
import { LoginPage } from "../pages/Auth/Login";
import { RegisterPage } from "../pages/Auth/Register/Register";
import React from "react";
import { RouteHeader } from "./RouteHeader";

export const TITLE_MAP: {[key in string]: (params: Params<string>) => string} = {
    "/home": () => "Домашняя страница",
    "/protected-route": () => "Защищённая страница",
}

export function AppRoutes() {
    const publicRoutes = useRoutes([
        {
            path: '/',
            element: <RouteHeader isProtected={false}/>,
            children: [
                { path: '/', element: <Navigate to='/home' replace /> },
                { path: '/home', element: <Typography>This is home!</Typography> },
                { path: '*', element: <Navigate to='/home' replace /> }
            ]
        }
    ]);
    const authRoutes = useRoutes([
        {
            path: '/',
            children: [
                { path: '/login', element: <LoginPage/> },
                { path: '/register', element: <RegisterPage/> },
            ]
        }
    ])
    const protectedRoutes = useRoutes([
        {
            path: '/',
            element: <RouteHeader isProtected/>,
            children: [
                { path: '/protected-route', element: <Typography>This protected home!</Typography> },
            ]
        }
    ]);

    return protectedRoutes ?? authRoutes ?? publicRoutes;
}