import { createApi, EndpointBuilder, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import redirectLoginOn401Query, { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import { endpoints as userEndpoints } from "./user";
import { endpoints as csrfEndpoints } from "./csrf";

export type BaseApiBuilder = EndpointBuilder<(args: any, api: any, extraOptions: any) => Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>, string, "baseApi">

export const usersBase = "users";

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
}))

export const {
    useGetCSRFQuery,
    useGetUserMeQuery,
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation
} = baseApi;