import { Typography } from "@mui/material";
import { Navigate, Params, useRoutes } from "react-router-dom";
import { LoginPage } from "../pages/Auth/Login";
import { RegisterPage } from "../pages/Auth/Register/Register";
import React from "react";
import { RouteHeader } from "./RouteHeader";
import { GenreListPage } from "../pages/Genre/List/GenreListPage";
import { GenreViewPage } from "../pages/Genre/View/GenreViewPage";
import { GenreUpdatePage } from "../pages/Genre/Update";
import { GenreCreatePage } from "../pages/Genre/Create";
import { PublishingHouseCreatePage } from "../pages/PublishingHouse/Create";
import { PublishingHouseUpdatePage } from "../pages/PublishingHouse/Update";
import { PublishingHouseViewPage } from "../pages/PublishingHouse/View";
import { PublishingHouseListPage } from "../pages/PublishingHouse/List";
import { AuthorCreatePage } from "../pages/Author/Create";
import { AuthorListPage } from "../pages/Author/List";
import { AuthorUpdatePage } from "../pages/Author/Update";
import { AuthorViewPage } from "../pages/Author/View";
import { BookDescriptionListPage } from "../pages/BookDescription/List";
import { BookDescriptionCreatePage } from "../pages/BookDescription/Create";
import { BookDescriptionViewPage } from "../pages/BookDescription/View";
import { BookDescriptionUpdatePage } from "../pages/BookDescription/Update";

export const TITLE_MAP: { [key in string]: (params: Params<string>) => string } = {
    "/home": () => "Домашняя страница",
    "/protected-route": () => "Защищённая страница",

    "/genres": () => "Жанры",
    "/genres/create": () => "Создать жанр",
    "/genres/:genreId": ({ genreId }) => `Жанр ${genreId}`,
    "/genres/:genreId/update": ({ genreId }) => `Обновить жанр ${genreId}`,

    "/publishing-houses": () => "Издательства",
    "/publishing-houses/create": () => "Создать издательство",
    "/publishing-houses/:publishingHouseId": ({ publishingHouseId }) => `Издательство ${publishingHouseId}`,
    "/publishing-houses/:publishingHouseId/update": ({ publishingHouseId }) => `Обновить издательство ${publishingHouseId}`,

    "/authors": () => "Авторы",
    "/authors/create": () => "Создать автора",
    "/authors/:authorId": ({ authorId }) => `Автор ${authorId}`,
    "/authors/:authorId/update": ({ authorId }) => `Обновить автора ${authorId}`,

    "/book-descriptions": () => "Книги",
    "/book-descriptions/create": () => "Создать описание книги",
    "/book-descriptions/:bookDescriptionId": ({ bookDescriptionId }) => `Книга ${bookDescriptionId}`,
    "/book-descriptions/:bookDescriptionId/update": ({ bookDescriptionId }) => `Обновить описание книги ${bookDescriptionId}`,
}

export function AppRoutes() {
    const routes = useRoutes([
        { path: '/', element: <Navigate to='/book-descriptions' replace /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        {
            path: '/',
            element: <RouteHeader isProtected />,
            children: [
                { path: '/protected-route', element: <Typography>This protected home!</Typography> },
                { path: '/genres/create', element: <GenreCreatePage /> },
                { path: '/genres/:genreId/update', element: <GenreUpdatePage /> },
                { path: '/publishing-houses/create', element: <PublishingHouseCreatePage /> },
                { path: '/publishing-houses/:publishingHouseId/update', element: <PublishingHouseUpdatePage /> },
                { path: '/authors/create', element: <AuthorCreatePage /> },
                { path: '/authors/:authorId/update', element: <AuthorUpdatePage /> },
                { path: '/book-descriptions/create', element: <BookDescriptionCreatePage /> },
                { path: '/book-descriptions/:bookDescriptionId/update', element: <BookDescriptionUpdatePage /> },
            ]
        },
        {
            path: '/',
            element: <RouteHeader isProtected={false} />,
            children: [
                { path: '/genres/:genreId', element: <GenreViewPage /> },
                { path: '/genres', element: <GenreListPage /> },
                { path: '/authors/:authorId', element: <AuthorViewPage /> },
                { path: '/authors', element: <AuthorListPage /> },
                { path: '/publishing-houses/:publishingHouseId', element: <PublishingHouseViewPage /> },
                { path: '/publishing-houses', element: <PublishingHouseListPage /> },
                { path: '/book-descriptions', element: <BookDescriptionListPage /> },
                { path: '/book-descriptions/:bookDescriptionId', element: <BookDescriptionViewPage /> },
            ]
        },
        { path: '*', element: <Navigate to='/book-descriptions' replace /> }
    ]);

    return <>{routes}</>;
}