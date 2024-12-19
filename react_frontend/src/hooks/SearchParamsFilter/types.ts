export interface SearchParamsFilters<T> {
    params: T
    setParams: (setObject: T) => void
    patchParams: (patchObject: Partial<T>) => void
}
