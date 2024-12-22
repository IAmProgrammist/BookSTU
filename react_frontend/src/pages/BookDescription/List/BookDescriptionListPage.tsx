import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, CircularProgress, Container, FormControl, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { useDebounce } from "hooks/useDebounce";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useGetAuthorListQuery, useGetBookDescriptionListQuery, useGetGenreListQuery, useGetPublishingHouseListQuery } from "../../../redux/api/baseApi";
import { useNavigate } from "react-router-dom";
import { useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { BookDescriptionListQuery } from "../../../redux/types/bookDescription";
import { useShowError } from "hooks/ShowError";
import { usePermissions } from "hooks/usePermissions";
import { Whoops } from "components/Whoops";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

const PAGE_SIZE = 15;

export function BookDescriptionListPage() {
    const { params, patchParams } = useSearchParamsFilter<Pick<BookDescriptionListQuery, "q" | "ordering" | "page" | "isbn" | "genres" | "publishing_house" | "authors">>("book-descriptions");

    const [genresSelected, setGenresSelected] = useState([]);
    const [genreLocalStr, setGenreLocalStr] = useState({ val: "", byUser: true });
    const debouncedGenreLocalStr = useDebounce(genreLocalStr);
    const { data: genresData, isLoading: genresIsLoading } = useGetGenreListQuery({
        q: debouncedGenreLocalStr.val,
        short: true,
        size: PAGE_SIZE
    });
    const mergedGenresOptions = genresSelected.concat((genresData?.results || []).filter((item) =>
        !genresSelected.some((item1) => item1.id === item.id)
    ));

    useEffect(() => {
        setGenresSelected(params?.genres || []);
    }, [params?.genres]);

    const [authorsSelected, setAuthorsSelected] = useState([]);
    const [authorLocalStr, setAuthorLocalStr] = useState({ val: "", byUser: true });
    const debouncedAuthorLocalStr = useDebounce(authorLocalStr);
    const { data: authorsData, isLoading: authorsIsLoading } = useGetAuthorListQuery({
        q: debouncedAuthorLocalStr.val,
        short: true,
        size: PAGE_SIZE
    });
    const mergedAuthorsOptions = authorsSelected.concat((authorsData?.results || []).filter((item) =>
        !authorsSelected.some((item1) => item1.id === item.id)
    ));

    useEffect(() => {
        setAuthorsSelected(params?.authors || []);
    }, [params?.authors]);

    const [publishingHousesSelected, setPublishingHousesSelected] = useState([]);
    const [publishingHouseLocalStr, setPublishingHouseLocalStr] = useState({ val: "", byUser: true });
    const debouncedPublishingHouseLocalStr = useDebounce(publishingHouseLocalStr);
    const { data: publishingHousesData, isLoading: publishingHousesIsLoading } = useGetPublishingHouseListQuery({
        q: debouncedPublishingHouseLocalStr.val,
        short: true,
        size: PAGE_SIZE
    });
    const mergedPublishingHousesOptions = publishingHousesSelected.concat((publishingHousesData?.results || []).filter((item) =>
        !publishingHousesSelected.some((item1) => item1.id === item.id)
    ));

    useEffect(() => {
        setPublishingHousesSelected(params?.publishing_house || []);
    }, [params?.publishing_house]);

    const navigate = useNavigate();

    const [localSearchString, setLocalSearchString] = useState({ val: "", byUser: false });
    const [localISBNString, setLocalISBNString] = useState({ val: "", byUser: false });

    const { data, isLoading, isError, error, isSuccess } = useGetBookDescriptionListQuery({
        q: params?.q,
        ordering: params?.ordering,
        page: params?.page,
        size: PAGE_SIZE,
        short: true,
        isbn: params?.isbn,
        genres: genresSelected.map((item) => item.id),
        publishing_house: publishingHousesSelected.map((item) => item.id),
        authors: authorsSelected.map((item) => item.id)
    });

    useShowError({
        isError,
        error
    });

    useEffect(() => {
        if (!isError) return;
        if ((error as any)?.status === 404 && (error as any)?.data?.detail?.startsWith("Invalid page") && params.page != 1) {
            patchParams({ page: 1 });
        }
    }, [isError, error]);

    useEffect(() => {
        setLocalSearchString({ val: params?.q ?? "", byUser: false });
    }, [params?.q])

    useEffect(() => {
        setLocalISBNString({ val: params?.isbn ?? "", byUser: false });
    }, [params?.isbn])

    const debouncedLocalSearchString = useDebounce(localSearchString, 500);
    const debouncedLocalISBNString = useDebounce(localISBNString, 500);

    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (!debouncedLocalSearchString.byUser) return;

        patchParams({ q: debouncedLocalSearchString.val ?? null });
    }, [debouncedLocalSearchString]);


    const firstRenderISBN = useRef(true);
    useEffect(() => {
        if (firstRenderISBN.current) {
            firstRenderISBN.current = false;
            return;
        }

        if (!debouncedLocalISBNString.byUser) return;

        patchParams({ isbn: debouncedLocalISBNString.val ?? null });
    }, [debouncedLocalISBNString]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowCreate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.add_bookdescription") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                    value={localSearchString.val}
                    onChange={(ev) => setLocalSearchString({ val: ev.target.value, byUser: true })}
                    label="Поиск" />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="ordering">Сортировка</InputLabel>
                    <Select
                        labelId="ordering"
                        id="ordering"
                        value={params?.ordering ?? null}
                        label="Сортировка"
                        onChange={(event) => {
                            patchParams({ ordering: event.target.value });
                        }}
                    >
                        <MenuItem value={null}>Без сортировки</MenuItem>
                        <MenuItem value="name">По имени по возрастанию</MenuItem>
                        <MenuItem value="-name">По имени по убыванию</MenuItem>
                        <MenuItem value="isbn">По ISBN по возрастанию</MenuItem>
                        <MenuItem value="-isbn">По ISBN по убыванию</MenuItem>
                        <MenuItem value="publishing_house__name">По издательству по возрастанию</MenuItem>
                        <MenuItem value="-publishing_house__name">По издательству по убыванию</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    value={localISBNString.val}
                    onChange={(ev) => setLocalISBNString({ val: ev.target.value, byUser: true })}
                    label="ISBN" />
                <Autocomplete
                    sx={{ minWidth: 150 }}
                    multiple
                    id="genres"
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    options={mergedGenresOptions}
                    loading={genresIsLoading}
                    value={genresSelected}
                    loadingText="Загрузка..."
                    noOptionsText="Не найдено"
                    inputValue={genreLocalStr.val}
                    onInputChange={(_ev, value) => setGenreLocalStr({ val: value, byUser: true })}
                    onChange={(_ev, value: any[]) => {
                        patchParams({ genres: value });
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
                <Autocomplete
                    sx={{ minWidth: 150 }}
                    multiple
                    id="authors"
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => `${option.surname} ${option.name} ${option.patronymics}`}
                    options={mergedAuthorsOptions}
                    loading={authorsIsLoading}
                    value={authorsSelected}
                    loadingText="Загрузка..."
                    noOptionsText="Не найдено"
                    inputValue={authorLocalStr.val}
                    onInputChange={(_ev, value) => setAuthorLocalStr({ val: value, byUser: true })}
                    onChange={(_ev, value: any[]) => {
                        patchParams({ authors: value });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Авторы"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {authorsIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                },
                            }}
                        />
                    )}
                />
                <Autocomplete
                    multiple
                    sx={{ minWidth: 150 }}
                    id="publishingHouses"
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    options={mergedPublishingHousesOptions}
                    loading={publishingHousesIsLoading}
                    value={publishingHousesSelected}
                    loadingText="Загрузка..."
                    noOptionsText="Не найдено"
                    inputValue={publishingHouseLocalStr.val}
                    onInputChange={(_ev, value) => setPublishingHouseLocalStr({ val: value, byUser: true })}
                    onChange={(_ev, value: any[]) => {
                        patchParams({ publishing_house: value.length ? [value[0]] : [] });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Издательство"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {publishingHousesIsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                },
                            }}
                        />
                    )}
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowCreate ? <Button onClick={() => navigate(`/book-descriptions/create`)}>Создать</Button> : null}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Описаний книг не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/book-descriptions/${item.id}`)}>
                        <CardHeader title={item.name} subheader={`ISBN: ${item.isbn}`} />
                        <CardMedia>
                            {item.icon ? <Box
                                sx={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover"
                                }}
                                component="img"
                                src={`${ENV_API_SERVER}/api/files/${item.icon}/`} /> :
                                <NoPhotographyIcon sx={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover"
                                }} />}
                        </CardMedia>
                    </CardActionArea>
                </Card>)}
            </Box>) : null}
        {data?.next || data?.previous ? <Pagination
            count={Math.ceil(data?.count / PAGE_SIZE)}
            page={params?.page}
            onChange={(_ev, page) => patchParams({ page })} /> : null}
    </Container>
}