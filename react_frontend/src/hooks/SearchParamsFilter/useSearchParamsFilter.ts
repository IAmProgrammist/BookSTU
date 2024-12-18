import { useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SP_ROOT = "page_state"

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function useSearchParamsFilter<T>(key, useParams = true) {
    const [decodedParams, setDecodedParams] = useState<T>();
    const [searchParams, setSearchParams] = useSearchParams();

    // При загрузке страницы
    useLayoutEffect(() => {
        const encoded = searchParams.get(SP_ROOT) || localStorage.getItem(key);
        const decoded = JSON.parse(encoded || "{}");

        // Обновить программные параметры поиска
        setDecodedParams(decoded);
        // Обновить параметры поиска страницы
        !isEmpty(decoded) && useParams && setSearchParams({...searchParams, [SP_ROOT]: encoded}, {replace: true});
    }, [useParams, key]);

    // При обновлении расположения
    useEffect(() => {
        if (!useParams) return;
        if (!searchParams.has(SP_ROOT)) return;
        // Получаем объект из параметров запроса и декодируем его
        const encoded = searchParams.get(SP_ROOT) || "{}";
        const decoded = JSON.parse(encoded || "{}");

        // Обновить программные параметры поиска
        setDecodedParams(decoded)
        // Обновляем в памяти браузера объект
        localStorage.setItem(key, encoded);
    }, [searchParams, useParams, key]);

    // Перезаписать параметры поиска
    const setParams = (setObject: T) => {
        const encoded = JSON.stringify(setObject);
        if (useParams)
            setSearchParams({...searchParams, [SP_ROOT]: encoded}) 
        else {
            setDecodedParams(setObject);
            localStorage.setItem(key, encoded);
        }
    }

    // Обновить параметры поиска
    const patchParams = (patchObject: Partial<T>) => {
        let copy = {...decodedParams};
        for (const key in patchObject) {
            if (patchObject[key] === null && copy.hasOwnProperty(key)) delete copy[key];
            else if (patchObject[key] !== null) copy[key] = patchObject[key];
        }

        setParams(copy);
    }

    return {params: decodedParams, setParams, patchParams}
}
