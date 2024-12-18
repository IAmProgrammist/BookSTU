import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import { useGetGenreListQuery } from "../../../redux/api/baseApi";
import React, { useEffect, useState } from "react";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "hooks/useDebounce";

export function GenreViewPage() {
    const navigate = useNavigate();

    const [localSearchString, setLocalSearchString] = useState("");
    const [genreListFecthOptions, setGenreListFecthOptions] = useState({
        q: "",
        short: true,
        ordering: null,
        size: 15,
        page: 1
    })
    const { data, isLoading, isError, error, isSuccess } = useGetGenreListQuery(genreListFecthOptions);

    useShowError({
        isError,
        error
    });

    useEffect(() => {
        if (!isError) return;
        if ((error as any)?.status === 404 && (error as any)?.data?.detail?.startsWith("Invalid page") && genreListFecthOptions.page != 1) {
            setGenreListFecthOptions((prev) => ({ ...prev, page: 1 }));
        }
    }, [isError, error]);

    const debouncedLocalSearchString = useDebounce(localSearchString);

    useEffect(() => {
        setGenreListFecthOptions((prev) => ({ ...prev, q: debouncedLocalSearchString }));
    }, [debouncedLocalSearchString]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                <TextField onChange={(ev) => setLocalSearchString(ev.target.value)} label="Поиск" />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="ordering">Сортировка</InputLabel>
                    <Select
                        labelId="ordering"
                        id="ordering"
                        value={genreListFecthOptions.ordering}
                        label="Сортировка"
                        onChange={(event) => {
                            setGenreListFecthOptions((prev) => ({ ...prev, ordering: event.target.value }));
                        }}
                    >
                        <MenuItem value={null}>Без сортировки</MenuItem>
                        <MenuItem value="name">По имени по возрастанию</MenuItem>
                        <MenuItem value="-name">По имени по убыванию</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Button>Создать</Button>
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? (data.results.length == 0 ? <Whoops title="Жанров не найдено" description="Возможно, Вы даже пополните этот ещё пополняющийся список" /> :
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr));",
                gap: 2,
                width: "100%",
                my: 4
            }}>
                {data.results.map((item) => <Card variant="outlined" key={item.id}>
                    <CardActionArea onClick={() => navigate(`/genres/${item.id}`)}>
                        <CardContent>
                            <Typography variant="h5">
                                {item.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>)}
            </Box>) : null}
        {data?.next || data?.previous ? <Pagination
            count={Math.ceil(data?.count / genreListFecthOptions.size)}
            page={genreListFecthOptions.page}
            onChange={(_ev, page) => setGenreListFecthOptions((prev) => ({ ...prev, page }))} /> : null}
    </Container>
}