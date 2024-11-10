import { Typography } from "@mui/material";
import { Navigate, useRoutes } from "react-router-dom";
import { LoginPage } from "../pages/Auth/Login";
import { RegisterPage } from "../pages/Auth/Register/Register";
import React from "react";

export function AppRoutes() {
    const mainRoutes = useRoutes([
        {
            path: '/',
            children: [
                { path: '/', element: <Navigate to='/home' replace /> },
                { path: '/home', element: <Typography>This is home!</Typography> },
                { path: '/login', element: <LoginPage/> },
                { path: '/register', element: <RegisterPage/> },
                { path: '*', element: <Navigate to='/home' replace /> }
            ]
        }
    ])

    return mainRoutes;
}