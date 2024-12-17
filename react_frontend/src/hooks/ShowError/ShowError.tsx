import { enqueueSnackbar, useSnackbar } from "notistack";
import { useEffect, useRef } from "react";
import { FieldError, ServerError, ShowErrorProps } from "./types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function useShowError({
    isError,
    error,
    formMethods,
    resourceMapping = {},
    onNotFound = () => { },
    onResourceForbidden = () => { }
}: ShowErrorProps) {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isError) return;
        if (!(error as FetchBaseQueryError)?.status) return;
        const fetchError = error as FetchBaseQueryError;

        const serverError = fetchError?.data as ServerError;
        let messageShown = false;

        if (serverError?.message) {
            enqueueSnackbar({
                message: serverError?.message,
                variant: "error"
            });
            messageShown = true;
        }

        if (formMethods && fetchError.status === "CUSTOM_ERROR") {
            for (const [resourceKey, resourceValues] of Object.entries(serverError)) {
                if (Array.isArray(resourceValues)) {
                    if (!resourceMapping[resourceKey]) {
                        formMethods.setError(resourceKey, { type: "validate", message: (resourceValues[0] as FieldError).message })
                    } else {
                        formMethods.setError(resourceMapping[resourceKey], { type: "validate", message: (resourceValues[0] as FieldError).message })
                    }
                }
            }
        } else if (!messageShown) {
            enqueueSnackbar({
                message: "Отправленные данные содержат ошибки",
                variant: "error",
            })
        }

    }, [isError]);
}
