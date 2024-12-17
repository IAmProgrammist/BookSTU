import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { UseFormReturn } from "react-hook-form"

export interface FieldError {
    message: string
    code: string
}

export type ServerError = {
    message?: string
} & {
    [key: string]: FieldError[]
}

/*
Компонент используется для обработки ошибок при запросе с бекенда
*/
export interface ShowErrorProps {
    // Есть ли ошибка в форме
    isError: boolean
    // Собственно, сама ошибка
    error: FetchBaseQueryError | SerializedError
    // Методы формы, не обязательно
    formMethods?: UseFormReturn<any, any, any>
    // Маппинг полей бекенда и полей в форме. Не обязательно
    resourceMapping?: {[key: string]: string}
    // Обработка ошибки, если ресурс не найден
    onNotFound?: () => void
    // Обработка ошибки, если ресурс недоступен
    onResourceForbidden?: () => void
}
