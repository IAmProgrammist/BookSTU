import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteUserMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetJournalListQuery, useGetUserQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { User } from "../../../redux/types/user";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";
import { ENV_API_SERVER } from "envconsts";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { SP_ROOT, useSearchParamsFilter } from "hooks/SearchParamsFilter";
import { JournalListQuery } from "redux/types/journal";

export function UserViewPage() {
    const { userId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteUser, deleteUserStatus] = useDeleteUserMutation();

    const { params, patchParams } = useSearchParamsFilter<Pick<JournalListQuery, "ordering" | "page">>(`journal-user-${userId}`);
    const { data: journalData, ...journalDataStatus } = useGetJournalListQuery({
        ordering: params?.ordering,
        page: params?.page,
        size: 15,
        user: userId,
    });
    const navigate = useNavigate();

    const { data, isError, isSuccess, isLoading, error } = useGetUserQuery({ id: userId });

    useShowError({
        isError, error
    });

    useShowError({
        isError: journalDataStatus.isError,
        error: journalDataStatus.error
    });

    useShowError({
        isError: deleteUserStatus.isError,
        error: deleteUserStatus.error
    });

    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_user") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate && <Button onClick={() => navigate(`/users/${userId}/update`)}>Обновить</Button>}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h4">{data.name}</Typography>
            </CardContent>
        </Card> : null}
    </Container>
}