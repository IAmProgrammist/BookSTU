import { PageableListQuery, PageableListResponse, SearcheableListQuery, SortableListQuery } from "./base"
import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

// Базовые модели
export interface PublishingHouseShort {
    id: number | string
    name: string
}

export interface PublishingHouse extends PublishingHouseShort {
    description: string
}

// Запросы
export interface PublishingHouseListQuery extends PageableListQuery, SortableListQuery, SearcheableListQuery {
    id?: PublishingHouse["id"][]
    short?: boolean
}

export interface PublishingHouseQuery {
    id: PublishingHouse["id"]
    short?: boolean
}

export interface PublishingHouseCreateQuery extends Exclude<PublishingHouse, "id">, CSRFMiddlewareTokenQueryFormMixin { }

export interface PublishingHouseUpdateQuery extends PublishingHouse, CSRFMiddlewareTokenQueryFormMixin { }

export interface PublishingHouseDeleteQuery extends CSRFMiddlewareTokenQueryFormMixin {
    id: PublishingHouseShort["id"]
}

// Ответы
export interface PublishingHouseListResponse extends PageableListResponse<PublishingHouseShort | PublishingHouse> { }

export type PublishingHouseResponse = PublishingHouseShort | PublishingHouse;

export interface PublishingHouseCreateResponse extends PublishingHouse { }

export interface PublishingHouseUpdateResponse extends PublishingHouse { }

export type PublishingHouseDeleteResponse = {}