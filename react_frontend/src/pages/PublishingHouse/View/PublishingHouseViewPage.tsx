import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDeletePublishingHouseMutation, useGetBookDescriptionListQuery, useGetCSRFQuery, useGetPublishingHouseQuery } from "../../../redux/api/baseApi";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { Whoops } from "../../../components/Whoops";
import { useShowError } from "hooks/ShowError";
import { useNavigate } from "react-router-dom";
import { PublishingHouse } from "../../../redux/types/publishingHouse";
import { ConfirmationDialog } from "components/ConfirmationDialog/ConfirmationDialog";
import { useSnackbar } from "notistack";
import { usePermissions } from "hooks/usePermissions";

export function PublishingHouseViewPage() {
    const { publishingHouseId } = useParams();
    const { data: csrfData } = useGetCSRFQuery({});
    const { enqueueSnackbar } = useSnackbar();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePublishingHouse, deletePublishingHouseStatus] = useDeletePublishingHouseMutation();
    const { data, isError, error, isLoading, isSuccess } = useGetPublishingHouseQuery({ id: publishingHouseId, short: false });
    const { data: booksData, isError: booksIsError, error: booksError, isLoading: booksIsLoading, isSuccess: booksIsSuccess } = useGetBookDescriptionListQuery({
        size: 5,
        publishing_house: [publishingHouseId]
    });
    const navigate = useNavigate();

    useShowError({
        isError, error
    });

    useShowError({
        isError: booksIsError,
        error: booksError
    });

    useShowError({
        isError: deletePublishingHouseStatus.isError,
        error: deletePublishingHouseStatus.error
    });

    useEffect(() => {
        if (!deletePublishingHouseStatus.isSuccess) return;
        enqueueSnackbar({
            message: "Издательство успешно удалено",
            variant: "success",
        })
        navigate(`/publishing-houses`)
    }, [deletePublishingHouseStatus]);


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowDelete = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.delete_genre") !== -1;
    }, [permissions, permissionsIsSuccess]);

    const shouldShowUpdate = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.change_genre") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <Container sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                {shouldShowUpdate ? <Button onClick={() => navigate(`/publishing-houses/${publishingHouseId}/update`)}>Обновить</Button> : null}
                {shouldShowDelete ? <Button onClick={() => setDeleteOpen(true)}>Удалить</Button> : null}
            </Box>
        </Box>
        {isError ? <Whoops /> :
            isLoading ? <CircularProgress /> : <></>}
        {isSuccess ? <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h4">{data.name}</Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body1">{(data as PublishingHouse)?.description}</Typography>
            </CardContent>
        </Card> : null}
        <Typography sx={{ alignSelf: "start" }} variant="h4">Книги этого издательства:</Typography>
        <ConfirmationDialog
            id="publishing-house-delete"
            keepMounted
            open={deleteOpen}
            title="Вы уверены?"
            description="Вы собираетесь удалить издательство, издательство будет удалено из книг."
            cancelText="Отмена"
            acceptText="Удалить"
            onClose={(val) => {
                setDeleteOpen(false);

                if (val)
                    deletePublishingHouse({ id: publishingHouseId, csrfmiddlewaretoken: csrfData.csrf });
            }} />
    </Container>
}