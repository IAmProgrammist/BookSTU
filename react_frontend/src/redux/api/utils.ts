import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { BACKEND_BASE_URL } from "envconsts";
import { LC_AUTH_CALLBACK } from "routes/RouteHeader";

const redirectLoginOn401Query = (apiPrefix = '/api') => async (args, api, extraOptions) => {
    let baseUrl = BACKEND_BASE_URL;
    if (apiPrefix)
        baseUrl += apiPrefix;
    const baseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            return headers
        }
    });
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 'FETCH_ERROR') {
        (result.error as any) = { ...result.error, fetchError: true }
        return result;
    }
    if (result.error?.status === 401) {
        localStorage.setItem(LC_AUTH_CALLBACK, window.location.href);
        window.location.href = `${BACKEND_BASE_URL}/login`;

        return result;
    }
    return result;
};

export const withQueryParams = (url, params) => {
    Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
            if (Array.isArray(value) && value.length)
                for (const arrKey in value)
                    url += (url.includes('?') ? '&' : '?') + `${key}=${encodeURI(value[arrKey])}`
            else if (!Array.isArray(value))
                url += (url.includes('?') ? '&' : '?') + `${key}=${encodeURI(`${value}`)}`;
        }
    });

    return url;
}

export const constructFormData = (object: object): FormData => {
    let formData = new FormData();
    
    Object.entries(object).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return formData;
}

export default redirectLoginOn401Query;
