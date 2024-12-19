import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

// Базовые модели
export interface GenreShort {
    id: number | string
    name: string
}

export interface Genre extends GenreShort {
    description: string
}

// Запросы
export interface GenreListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: Genre["id"][]
    short?: boolean
}

export interface GenreQuery {
    id: Genre["id"]
    short?: boolean
}

export interface GenreCreateQuery extends Exclude<Genre, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface GenreUpdateQuery extends Genre, CSRFMiddlewareTokenQueryFormMixin { }

export interface GenreDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: GenreShort["id"]
}

// Ответы
export interface GenreListResponse extends PageableListResponse<GenreShort | Genre> { }

export type GenreResponse = GenreShort | Genre;

export interface GenreCreateResponse extends Genre { }

export interface GenreUpdateResponse extends Genre { }

export type GenreDeleteResponse = {}