import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"
import { FileObj } from "./file"

// Базовые модели
export interface AuthorShort {
    id: number | string
    name: string
    surname: string
    patronymics: string
    icon: FileObj["id"]
}

export interface Author extends AuthorShort {
    description: string
}

// Запросы
export interface AuthorListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: Author["id"][]
    short?: boolean
}

export interface AuthorQuery {
    id: Author["id"]
    short?: boolean
}

export interface AuthorCreateQuery extends Exclude<Author, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface AuthorUpdateQuery extends Author, CSRFMiddlewareTokenQueryFormMixin { }

export interface AuthorDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: AuthorShort["id"]
}

// Ответы
export interface AuthorListResponse extends PageableListResponse<AuthorShort | Author> { }

export type AuthorResponse = AuthorShort | Author;

export interface AuthorCreateResponse extends Author { }

export interface AuthorUpdateResponse extends Author { }

export type AuthorDeleteResponse = {}