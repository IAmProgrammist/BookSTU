import { BaseApiBuilder } from "../api/baseApi";
import { shortBase } from "../types/base";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    GenreCreateQuery,
    GenreCreateResponse,
    GenreDeleteQuery,
    GenreDeleteResponse,
    GenreListQuery,
    GenreListResponse,
    GenreQuery,
    GenreResponse,
    GenreUpdateQuery,
    GenreUpdateResponse
} from "../types/genre";

export const genresBase = "genres";
export const genresShortBase = shortBase + genresBase;

export const endpoints = (builder: BaseApiBuilder) => ({
    getGenreList: builder.query<GenreListResponse, GenreListQuery>({
        query: ({ short = true, ...data }) => withQueryParams(`/${short ? genresShortBase : genresBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Genre,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.Genre, id: item.id })))
        ]
    }),
    getGenre: builder.query<GenreResponse, GenreQuery>({
        query: ({ short = true, id }) => withQueryParams(`/${short ? genresShortBase : genresBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Genre, id: result.id }
        ]
    }),
    createGenre: builder.mutation<GenreCreateResponse, GenreCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${genresBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Genre, id: result.id }
        ]
    }),
    updateGenre: builder.mutation<GenreUpdateResponse, GenreUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${genresBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.Genre, id: arg.id }
        ]
    }),
    deleteGenre: builder.mutation<GenreDeleteResponse, GenreDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${genresBase}/${id}/`, {}),
            method: "DELETE"
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.Genre, id: arg.id }
        ]
    })
})