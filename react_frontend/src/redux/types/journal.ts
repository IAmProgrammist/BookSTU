import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { Book } from "./book"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"
import { UserMe } from "./user"

// Базовые модели
export interface Journal {
    id: number | string
    book: Book["id"]
    begin_date: string
    end_date: string
    returned_date?: string
    user: UserMe["user_id"]
}

// Запросы
export interface JournalListQuery extends PageableListQuery, SortableListQuery {
    book?: Book["id"]
}

export interface JournalQuery {
    id: Journal["id"]
}

export interface JournalCreateQuery extends Exclude<Journal, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface JournalUpdateQuery extends Journal, CSRFMiddlewareTokenQueryFormMixin { }

export interface JournalDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: Journal["id"]
}

// Ответы
export interface JournalListResponse extends PageableListResponse<Journal> { }

export interface JournalResponse extends Journal {}

export interface JournalCreateResponse extends Journal { }

export interface JournalUpdateResponse extends Journal { }

export type JournalDeleteResponse = {}