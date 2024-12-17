import { createApi, EndpointBuilder, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react";
import redirectLoginOn401Query, { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import { CSRFQuery, CSRFResponse } from "redux/types/csrf";
import { UserAuthResponse, UserLoginQuery, UserMeQuery, UserMeResponse, UserSignupQuery } from "redux/types/user";

export type BaseApiBuilder = EndpointBuilder<(args: any, api: any, extraOptions: any) => Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>, string, "baseApi">

export const usersBase = "users";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: [
        QUERY_TAGS.CSRF,
        QUERY_TAGS.User
    ],
    baseQuery: redirectLoginOn401Query("/api"),
    endpoints: (builder) => ({
        // CSRF
        getCSRF: builder.query<CSRFResponse, CSRFQuery>({
            query: () => withQueryParams(`/csrf/`, {}),
            providesTags: () => [
                QUERY_TAGS.CSRF
            ]
        }),

        // Пользователи
        signupUser: builder.mutation<UserAuthResponse, UserSignupQuery>({
            query: (data) => ({
                url: withQueryParams(`/signup/`, {}),
                method: "POST",
                body: constructFormData(data)
            }),
            invalidatesTags: () => [
                QUERY_TAGS.CSRF
            ]
        }),
        loginUser: builder.mutation<UserAuthResponse, UserLoginQuery>({
            query: (data) => ({
                url: withQueryParams(`/signup/`, {}),
                method: "POST",
                body: constructFormData(data)
            }),
            invalidatesTags: () => [
                QUERY_TAGS.CSRF
            ]
        }),
        getUserMe: builder.query<UserMeResponse, UserMeQuery>({
            query: withQueryParams(`/${usersBase}/me/`, {}),
            providesTags: (result, _error, _arg) => [
                { type: QUERY_TAGS.User, id: result.user_id }
            ]
        })
    })
})

export const {
    useGetCSRFQuery,
    useGetUserMeQuery,
    useSignupUserMutation,
    useLoginUserMutation,
} = baseApi;