import { createApi, EndpointBuilder, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import redirectLoginOn401Query from "./utils";
import { endpoints as userEndpoints } from "./user";

export type BaseApiBuilder = EndpointBuilder<(args: any, api: any, extraOptions: any) => Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>, string, "baseApi">

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: [],
    baseQuery: redirectLoginOn401Query("/api"),
    endpoints: () => ({})
}).injectEndpoints({
    endpoints: userEndpoints,
    overrideExisting: false
})

export const {
    useGetUserMeQuery,
    useSignupUserMutation,
    useLoginUserMutation
} = baseApi;