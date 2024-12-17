import { BaseApiBuilder } from "redux/api/baseApi";
import { withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import { CSRFQuery, CSRFResponse } from "redux/types/csrf";

export const endpoints = (builder: BaseApiBuilder) => ({
    getCSRF: builder.query<CSRFResponse, CSRFQuery>({
        query: withQueryParams(`/csrf/`, {}),
        providesTags: () => [
            QUERY_TAGS.CSRF
        ]
    })
})