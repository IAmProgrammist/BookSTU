import { BaseApiBuilder } from "../api/baseApi";
import { shortBase } from "../types/base";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    AuthorCreateQuery,
    AuthorCreateResponse,
    AuthorDeleteQuery,
    AuthorDeleteResponse,
    AuthorListQuery,
    AuthorListResponse,
    AuthorQuery,
    AuthorResponse,
    AuthorUpdateQuery,
    AuthorUpdateResponse
} from "../types/author";

export const authorsBase = "authors";
export const authorsShortBase = shortBase + authorsBase;

export const endpoints = (builder: BaseApiBuilder) => ({
    getAuthorList: builder.query<AuthorListResponse, AuthorListQuery>({
        query: ({ short = true, ...data }) => withQueryParams(`/${short ? authorsShortBase : authorsBase }/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Author,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.Author, id: item.id })))
        ]
    }),
    getAuthor: builder.query<AuthorResponse, AuthorQuery>({
        query: ({ short = true, id }) => withQueryParams(`/${short ? authorsShortBase : authorsBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Author, id: result.id }
        ]
    }),
    createAuthor: builder.mutation<AuthorCreateResponse, AuthorCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${authorsBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Author, id: result.id }
        ]
    }),
    updateAuthor: builder.mutation<AuthorUpdateResponse, AuthorUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${authorsBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        })
    }),
    deleteAuthor: builder.mutation<AuthorDeleteResponse, AuthorDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${authorsBase}/${id}/`, {}),
            method: "DELETE"
        })
    })
})