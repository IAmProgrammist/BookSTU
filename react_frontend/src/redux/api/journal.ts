import { BaseApiBuilder } from "../api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    JournalCreateQuery,
    JournalCreateResponse,
    JournalDeleteQuery,
    JournalDeleteResponse,
    JournalListQuery,
    JournalListResponse,
    JournalQuery,
    JournalResponse,
    JournalUpdateQuery,
    JournalUpdateResponse
} from "../types/journal";

export const journalDescriptionsBase = "journals";

export const endpoints = (builder: BaseApiBuilder) => ({
    getJournalList: builder.query<JournalListResponse, JournalListQuery>({
        query: ({ ...data }) => withQueryParams(`/${journalDescriptionsBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Journal,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.Journal, id: item.id })))
        ]
    }),
    getJournal: builder.query<JournalResponse, JournalQuery>({
        query: ({ id }) => withQueryParams(`/${journalDescriptionsBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.Journal, id: result.id }
        ]
    }),
    createJournal: builder.mutation<JournalCreateResponse, JournalCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${journalDescriptionsBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            QUERY_TAGS.Journal,
            { type: QUERY_TAGS.Journal, id: result.id }
        ]
    }),
    updateJournal: builder.mutation<JournalUpdateResponse, JournalUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${journalDescriptionsBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.Journal, id: arg.id }
        ]
    }),
    deleteJournal: builder.mutation<JournalDeleteResponse, JournalDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${journalDescriptionsBase}/${id}/`, {}),
            method: "DELETE"
        }),
        invalidatesTags: (_result, error, arg) => error ? [] : [
            QUERY_TAGS.Journal,
            { type: QUERY_TAGS.Journal, id: arg.id }
        ]
    })
})