import { BaseApiBuilder } from "../api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    BookCreateQuery,
    BookCreateResponse,
    BookDeleteQuery,
    BookDeleteResponse,
    BookListQuery,
    BookListResponse,
    BookQuery,
    BookResponse,
    BookUpdateQuery,
    BookUpdateResponse
} from "../types/book";

export const bookDescriptionsBase = "books";

export const endpoints = (builder: BaseApiBuilder) => ({
    getBookList: builder.query<BookListResponse, BookListQuery>({
        query: ({ ...data }) => withQueryParams(`/${bookDescriptionsBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Book,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.Book, id: item.id })))
        ]
    }),
    getBook: builder.query<BookResponse, BookQuery>({
        query: ({ id }) => withQueryParams(`/${bookDescriptionsBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Book, id: result.id }
        ]
    }),
    createBook: builder.mutation<BookCreateResponse, BookCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Book,
            { type: QUERY_TAGS.Book, id: result.id }
        ]
    }),
    updateBook: builder.mutation<BookUpdateResponse, BookUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.Book, id: arg.id }
        ]
    }),
    deleteBook: builder.mutation<BookDeleteResponse, BookDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/${id}/`, {}),
            method: "DELETE"
        }),
        invalidatesTags: (_result, error, arg) => error ? [] : [
            QUERY_TAGS.Book,
            { type: QUERY_TAGS.Book, id: arg.id }
        ]
    })
})