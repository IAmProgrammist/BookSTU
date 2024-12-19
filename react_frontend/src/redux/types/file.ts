import { CSRFMiddlewareTokenQueryFormMixin } from "./csrf"

export interface FileObj {
    id: string | number
}

export interface FileCreateQuery extends CSRFMiddlewareTokenQueryFormMixin {
    file: File
}

export interface FileCreateResponse {
    id: FileObj["id"]
}