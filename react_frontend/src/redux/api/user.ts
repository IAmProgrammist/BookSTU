import { UserAuthResponse, UserLoginQuery, UserLogoutQuery, UserMeQuery, UserMeResponse, UserSignupQuery } from "redux/types/user";
import { BaseApiBuilder } from "redux/api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    UserDeleteQuery,
    UserDeleteResponse,
    UserListQuery,
    UserListResponse,
    UserQuery,
    UserResponse,
    UserUpdateQuery,
    UserUpdateResponse
} from "../types/user";


export const usersBase = "users";

export const endpoints = (builder: BaseApiBuilder) => ({
    signupUser: builder.mutation<UserAuthResponse, UserSignupQuery>({
        query: (data) => ({
            url: withQueryParams(`/signup/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: () => [
            QUERY_TAGS.CSRF,
            QUERY_TAGS.Me
        ]
    }),
    loginUser: builder.mutation<UserAuthResponse, UserLoginQuery>({
        query: (data) => ({
            url: withQueryParams(`/login/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: () => [
            QUERY_TAGS.CSRF,
            QUERY_TAGS.Me
        ]
    }),
    logoutUser: builder.mutation<UserAuthResponse, UserLogoutQuery>({
        query: () => ({
            url: withQueryParams(`/logout/`, {}),
            method: "GET"
        }),
        invalidatesTags: () => [
            QUERY_TAGS.Me
        ]
    }),
    getUserMe: builder.query<UserMeResponse, UserMeQuery>({
        query: () => withQueryParams(`/${usersBase}/me/`, {}),
        providesTags: (result, _error, _arg) => [
            QUERY_TAGS.Me,
            ...(result?.user_id ? [{ type: QUERY_TAGS.User, id: result.user_id }] : [])
        ]
    }),

    getUserList: builder.query<UserListResponse, UserListQuery>({
        query: ({ ...data }) => withQueryParams(`/${usersBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.User,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.User, id: item.id })))
        ]
    }),
    getUser: builder.query<UserResponse, UserQuery>({
        query: ({ id }) => withQueryParams(`/${usersBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.User, id: result.id }
        ]
    }),
    updateUser: builder.mutation<UserUpdateResponse, UserUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${usersBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, _error, arg) => [
            { type: QUERY_TAGS.User, id: arg.id }
        ]
    }),
    deleteUser: builder.mutation<UserDeleteResponse, UserDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${usersBase}/${id}/`, {}),
            method: "DELETE"
        }),
        invalidatesTags: (_result, _error, arg) => [
            QUERY_TAGS.User,
            { type: QUERY_TAGS.User, id: arg.id }
        ]
    })
})