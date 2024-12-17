import { Card, CardActions, CardContent, CardHeader, Container, Stack } from "@mui/material";
import { AuthWrapperProps } from "./types";
import React from "react";

export function AuthWrapper({ title, children, actions }: AuthWrapperProps) {
    return <Container maxWidth="sm" sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        py: 4
    }}>
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <Stack spacing={4}>
                    {children}
                </Stack>
            </CardContent>
            <CardActions>
                {actions}
            </CardActions>
        </Card>
    </Container>
}