import { BaseApiBuilder } from "../api/baseApi";
import { shortBase } from "../types/base";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    BookDescriptionCreateQuery,
    BookDescriptionCreateResponse,
    BookDescriptionDeleteQuery,
    BookDescriptionDeleteResponse,
    BookDescriptionListQuery,
    BookDescriptionListResponse,
    BookDescriptionQuery,
    BookDescriptionResponse,
    BookDescriptionUpdateQuery,
    BookDescriptionUpdateResponse
} from "../types/bookDescription";

export const bookDescriptionsBase = "book-descriptions";
export const bookDescriptionsShortBase = shortBase + bookDescriptionsBase;

export const endpoints = (builder: BaseApiBuilder) => ({
    getBookDescriptionList: builder.query<BookDescriptionListResponse, BookDescriptionListQuery>({
        query: ({ short = true, ...data }) => withQueryParams(`/${short ? bookDescriptionsShortBase : bookDescriptionsBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.BookDescription,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.BookDescription, id: item.id })))
        ]
    }),
    getBookDescription: builder.query<BookDescriptionResponse, BookDescriptionQuery>({
        query: ({ short = true, id }) => withQueryParams(`/${short ? bookDescriptionsShortBase : bookDescriptionsBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.BookDescription, id: result.id }
        ]
    }),
    createBookDescription: builder.mutation<BookDescriptionCreateResponse, BookDescriptionCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            QUERY_TAGS.BookDescription,
            { type: QUERY_TAGS.BookDescription, id: result.id }
        ]
    }),
    updateBookDescription: builder.mutation<BookDescriptionUpdateResponse, BookDescriptionUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.BookDescription, id: arg.id }
        ]
    }),
    deleteBookDescription: builder.mutation<BookDescriptionDeleteResponse, BookDescriptionDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${bookDescriptionsBase}/${id}/`, {}),
            method: "DELETE"
        }),
        invalidatesTags: (_result, error, arg) => error ? [] : [
            QUERY_TAGS.BookDescription,
            { type: QUERY_TAGS.BookDescription, id: arg.id }
        ]
    })
})