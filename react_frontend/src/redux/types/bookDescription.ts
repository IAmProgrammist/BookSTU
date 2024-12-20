import { Author } from "./author"
import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"
import { FileObj } from "./file"
import { Genre } from "./genre"
import { PublishingHouse } from "./publishingHouse"

// Базовые модели
export interface BookDescriptionShort {
    id: number | string
    name: string
    isbn: string
    genres: Genre["id"][]
    publishing_house: PublishingHouse["id"]
    authors: Author["id"][]
    icon: FileObj["id"]
}

export interface BookDescription extends BookDescriptionShort {
    description: string
}

// Запросы
export interface BookDescriptionListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: BookDescription["id"][]
    short?: boolean
    isbn?: string
    genres?: Genre["id"][]
    publishing_house?: PublishingHouse["id"][]
    authors?: Author["id"][]
}

export interface BookDescriptionQuery {
    id: BookDescription["id"]
    short?: boolean
}

export interface BookDescriptionCreateQuery extends Exclude<BookDescription, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface BookDescriptionUpdateQuery extends BookDescription, CSRFMiddlewareTokenQueryFormMixin { }

export interface BookDescriptionDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: BookDescriptionShort["id"]
}

// Ответы
export interface BookDescriptionListResponse extends PageableListResponse<BookDescriptionShort | BookDescription> { }

export type BookDescriptionResponse = BookDescriptionShort | BookDescription;

export interface BookDescriptionCreateResponse extends BookDescription { }

export interface BookDescriptionUpdateResponse extends BookDescription { }

export type BookDescriptionDeleteResponse = {}