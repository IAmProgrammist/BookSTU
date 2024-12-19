import { Box, Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import React from "react"
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { WhoopsProps } from "./types";

export function Whoops({ title, description }: WhoopsProps) {
    return <Card sx={{maxWidth: 450}}>
        <CardHeader>
            <Typography sx={{ textAlign: "center" }} variant="h4">{title ?? <>Что-то пошло не так!</>}</Typography>
        </CardHeader>
        <CardMedia>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SentimentVeryDissatisfiedIcon sx={{ width: 120, height: 120, marginLeft: "auto", marginRight: "auto" }} />
            </Box>
        </CardMedia>
        <CardContent>
            <Typography sx={{ textAlign: "center" }} variant="body1">
                {description ?? <>Не получилось получить доступ к ресурсу, попробуйте позже</>}
            </Typography>
        </CardContent>
    </Card>
} 