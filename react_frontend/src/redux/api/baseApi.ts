import { createApi, EndpointBuilder, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import redirectLoginOn401Query from "./utils";
import { QUERY_TAGS } from "../types/tags";
import { endpoints as userEndpoints } from "./user";
import { endpoints as csrfEndpoints } from "./csrf";
import { endpoints as authorEndpoints } from "./author";
import { endpoints as bookDescriptionEndpoints } from "./bookDescription";
import { endpoints as genreEndpoints } from "./genre";
import { endpoints as publishingHouseEndpoints } from "./publishingHouse";
import { endpoints as filesEndpoints } from "./file";
import { endpoints as booksEndpoints } from "./book";
import { endpoints as journalsEndpoints } from "./journal";

export type BaseApiBuilder = EndpointBuilder<(args: any, api: any, extraOptions: any) => Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>, string, "baseApi">

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: Object.values(QUERY_TAGS),
    baseQuery: redirectLoginOn401Query("/api"),
    endpoints: () => ({})
}).injectEndpoints(({
    endpoints: userEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: csrfEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: authorEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: bookDescriptionEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: genreEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: publishingHouseEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: filesEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: booksEndpoints,
    overrideExisting: false
})).injectEndpoints(({
    endpoints: journalsEndpoints,
    overrideExisting: false
}));

export const {
    useGetCSRFQuery,
    useGetUserMeQuery,
    useGetAuthorListQuery,
    useGetBookDescriptionListQuery,
    useGetGenreListQuery,
    useGetBookListQuery,
    useGetPublishingHouseListQuery,
    useGetJournalListQuery,
    useGetUserListQuery,
    useGetAuthorQuery,
    useGetBookDescriptionQuery,
    useGetGenreQuery,
    useGetPublishingHouseQuery,
    useGetBookQuery,
    useGetJournalQuery,
    useGetUserQuery,
    useCreateAuthorMutation,
    useCreateBookDescriptionMutation,
    useCreateGenreMutation,
    useCreatePublishingHouseMutation,
    useCreateFileMutation,
    useCreateBookMutation,
    useCreateJournalMutation,
    useUpdateAuthorMutation,
    useUpdateBookDescriptionMutation,
    useUpdateGenreMutation,
    useUpdatePublishingHouseMutation,
    useUpdateBookMutation,
    useUpdateJournalMutation,
    useUpdateUserMutation,
    useDeleteAuthorMutation,
    useDeleteBookDescriptionMutation,
    useDeleteGenreMutation,
    useDeletePublishingHouseMutation,
    useDeleteBookMutation,
    useDeleteJournalMutation,
    useDeleteUserMutation,
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    usePatchUserMutation,
} = baseApi;