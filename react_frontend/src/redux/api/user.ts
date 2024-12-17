import { UserAuthResponse, UserLoginQuery, UserMeQuery, UserMeResponse, UserSignupQuery } from "redux/types/user";
import { BaseApiBuilder } from "redux/api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";

export const usersBase = "users";

export const endpoints = (builder: BaseApiBuilder) => ({
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