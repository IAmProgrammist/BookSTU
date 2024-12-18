import { createApi, EndpointBuilder, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import redirectLoginOn401Query from "./utils";
import { QUERY_TAGS } from "../types/tags";
import { endpoints as userEndpoints } from "./user";
import { endpoints as csrfEndpoints } from "./csrf";
import { endpoints as authorEndpoints } from "./author";
import { endpoints as bookDescriptionEndpoints } from "./bookDescription";
import { endpoints as genreEndpoints } from "./genre";
import { endpoints as publishingHouseEndpoints } from "./publishingHouse";

export type BaseApiBuilder = EndpointBuilder<(args: any, api: any, extraOptions: any) => Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>, string, "baseApi">

export const shortBase = "short-";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: [
        QUERY_TAGS.CSRF,
        QUERY_TAGS.User,
        QUERY_TAGS.Me
    ],
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
}))

export const {
    useGetCSRFQuery,
    useGetUserMeQuery,
    useGetAuthorListQuery,
    useGetBookDescriptionListQuery,
    useGetGenreListQuery,
    useGetPublishingHouseListQuery,
    useGetAuthorQuery,
    useGetBookDescriptionQuery,
    useGetGenreQuery,
    useGetPublishingHouseQuery,
    useCreateAuthorMutation,
    useCreateBookDescriptionMutation,
    useCreateGenreMutation,
    useCreatePublishingHouseMutation,
    useUpdateAuthorMutation,
    useUpdateBookDescriptionMutation,
    useUpdateGenreMutation,
    useUpdatePublishingHouseMutation,
    useDeleteAuthorMutation,
    useDeleteBookDescriptionMutation,
    useDeleteGenreMutation,
    useDeletePublishingHouseMutation,
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation
} = baseApi;