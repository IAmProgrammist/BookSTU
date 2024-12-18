import { BaseApiBuilder, shortBase } from "../api/baseApi";
import { constructFormData, withQueryParams } from "./utils";
import { QUERY_TAGS } from "../types/tags";
import {
    PublishingHouseCreateQuery,
    PublishingHouseCreateResponse,
    PublishingHouseDeleteQuery,
    PublishingHouseDeleteResponse,
    PublishingHouseListQuery,
    PublishingHouseListResponse,
    PublishingHouseQuery,
    PublishingHouseResponse,
    PublishingHouseUpdateQuery,
    PublishingHouseUpdateResponse
} from "../types/publishingHouse";

export const publishingHousesBase = "publishing-houses";
export const publishingHousesShortBase = shortBase + publishingHousesBase;

export const endpoints = (builder: BaseApiBuilder) => ({
    getPublishingHouseList: builder.query<PublishingHouseListResponse, PublishingHouseListQuery>({
        query: ({ short = true, ...data }) => withQueryParams(`/${short ? publishingHousesBase : publishingHousesShortBase}/`, data),
        providesTags: (result, error) => error ? [] : [
            QUERY_TAGS.PublishingHouse,
            ...(result.results.map((item) => ({ type: QUERY_TAGS.PublishingHouse, id: item.id })))
        ]
    }),
    getPublishingHouse: builder.query<PublishingHouseResponse, PublishingHouseQuery>({
        query: ({ short = true, id }) => withQueryParams(`/${short ? publishingHousesBase : publishingHousesShortBase}/${id}/`, {}),
        providesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.PublishingHouse, id: result.id }
        ]
    }),
    createPublishingHouse: builder.mutation<PublishingHouseCreateResponse, PublishingHouseCreateQuery>({
        query: ({ ...data }) => ({
            url: withQueryParams(`/${publishingHousesBase}/`, {}),
            method: "POST",
            body: constructFormData(data)
        }),
        invalidatesTags: (result, error) => error ? [] : [
            { type: QUERY_TAGS.PublishingHouse, id: result.id }
        ]
    }),
    updatePublishingHouse: builder.mutation<PublishingHouseUpdateResponse, PublishingHouseUpdateQuery>({
        query: ({ id, ...data }) => ({
            url: withQueryParams(`/${publishingHousesBase}/${id}/`, {}),
            method: "PUT",
            body: constructFormData(data)
        })
    }),
    deletePublishingHouse: builder.mutation<PublishingHouseDeleteResponse, PublishingHouseDeleteQuery>({
        query: ({ id }) => ({
            url: withQueryParams(`/${publishingHousesBase}/${id}/`, {}),
            method: "DELETE"
        })
    })
})