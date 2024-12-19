export interface PageableListQuery {
    page?: number
    size?: number
}

export interface SortableListQuery {
    ordering?: string
}

export interface SearcheableListQuery {
    q?: string
}

export interface PageableListResponse<T> {
    count: number
    next: string
    previous: string
    results: T[]
}

export const shortBase = "short-";