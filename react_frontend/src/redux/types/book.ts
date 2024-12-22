import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { BookDescription } from "./bookDescription"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

// Базовые модели
export enum BookState {
    NEW = "0",
    GOOD = "1",
    WORN = "2",
    UNDER_REPAIR = "3",
    WRITTEN_OFF = "4",
    LOST = "5"
}

export interface Book {
    id: number | string
    inventory_number: string
    description: BookDescription["id"]
    state: BookState
}

// Запросы
export interface BookListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: Book["id"][]
    state?: BookState[]
    description?: BookDescription["id"]
}

export interface BookQuery {
    id: Book["id"]
}

export interface BookCreateQuery extends Exclude<Book, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface BookUpdateQuery extends Book, CSRFMiddlewareTokenQueryFormMixin { }

export interface BookDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: Book["id"]
}

// Ответы
export interface BookListResponse extends PageableListResponse<Book> { }

export interface BookResponse extends Book {}

export interface BookCreateResponse extends Book { }

export interface BookUpdateResponse extends Book { }

export type BookDeleteResponse = {}