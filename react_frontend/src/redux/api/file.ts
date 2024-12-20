import { QUERY_TAGS } from "../types/tags";
import { BaseApiBuilder } from "../api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { FileCreateQuery, FileCreateResponse } from "../types/file";

export const filesBase = "files";

export const endpoints = (builder: BaseApiBuilder) => ({
    createFile: builder.mutation<FileCreateResponse, FileCreateQuery>({
        query: (data) => ({
            url: withQueryParams(`/${filesBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (_result, error, _arg) => error ? [] : [
            QUERY_TAGS.CSRF
        ]
    }),
})