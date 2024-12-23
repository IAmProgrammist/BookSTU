import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

// Базовые модели
export interface UserMe {
    is_authenticated: boolean
    banned?: boolean
    user_id?: number
    username: string
    surname: string
    patronymics: string
    email: string
    phone_number: string
    passport_data: string
    permissions?: string[]
}

export interface User {
    id: number | string
    user: {
        id: User["id"]
        username: string
    }
    phone_number: string
    surname: string
    name: string
    patronymics?: string
    passport_data: string
    banned: boolean
}

// Запросы
export interface UserSignupQuery extends CSRFMiddlewareTokenQueryFormMixin, Exclude<UserMe, "is_authenticated" | "banned" | "user_id"> {
    password1: string
    password2: string
}

export interface UserLoginQuery extends CSRFMiddlewareTokenQueryFormMixin {
    login: string
    password: string
}

export interface UserLogoutQuery { }

export interface UserMeQuery {
}

export interface UserListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: User["id"][]
    banned?: boolean
}

export interface UserQuery {
    id: User["id"]
}

export interface UserUpdateQuery extends User, CSRFMiddlewareTokenQueryFormMixin { }

export interface UserDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: User["id"]
}

// Ответы
export interface UserAuthResponse { }

export interface UserMeResponse extends UserMe { }

export interface UserListResponse extends PageableListResponse<User> { }

export interface UserResponse extends User { }

export interface UserUpdateResponse extends User { }

export type UserDeleteResponse = {}
