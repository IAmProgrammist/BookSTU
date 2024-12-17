import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

export interface User {
    is_authenticated: boolean
    banned?: boolean
    user_id?: number
    name: string
    surname: string
    patronymics: string
    email: string
    phone_number: string
    passport_data: string
}

export interface UserSignupQuery extends CSRFMiddlewareTokenQueryFormMixin, Exclude<User, "is_authenticated" | "banned" | "user_id"> {
    password1: string
    password2: string
}

export interface UserLoginQuery extends CSRFMiddlewareTokenQueryFormMixin {
    login: string
    password: string
}

export interface UserAuthResponse {
}

export interface UserMeQuery {
}

export interface UserMeResponse extends User {
}