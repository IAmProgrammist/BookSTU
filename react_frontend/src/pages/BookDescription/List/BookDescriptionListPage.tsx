import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useDebounce } from "hooks/useDebounce";
import { useState } from "react";
import React from "react";
import { useGetGenreListQuery } from "../../../redux/api/baseApi";

export function BookDescriptionListQuery() {
    const [genresSelected, setGenresSelected] = useState([]);
    const [genreLocalStr, setGenreLocalStr] = useState({ val: "", byUser: true });
    const debouncedGenreLocalStr = useDebounce(genreLocalStr);
    const { data: genresData, isLoading: genresIsLoading } = useGetGenreListQuery({
        q: debouncedGenreLocalStr.val,
        short: true,
        size: 15
    });
    const mergedGenresOptions = genresSelected.concat((genresData?.results || []).filter((item) => 
        !genresSelected.some((item1) => item1.id === item.id)
    ));

    return <Autocomplete
        multiple
        id="genres"
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={mergedGenresOptions}
        loading={genresIsLoading}
        loadingText="Загрузка..."
        noOptionsText="Не найдено"
        inputValue={genreLocalStr.val}
        onInputChange={(_ev, value) => setGenreLocalStr({ val: value, byUser: true })}
        onChange={(_ev, value: any[]) => {
            setGenresSelected(value);
        }}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Жанры"
                slotProps={{
                    input: {
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {genresIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    },
                }}
            />
        )}
    />
}