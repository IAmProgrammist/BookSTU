import { ConfirmationDialogProps } from "./types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

export function ConfirmationDialog(props: ConfirmationDialogProps) {
    const { onClose, ...other } = props;

    const handleCancel = () => {
        onClose(false);
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            {...other}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.description}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    {props.cancelText ?? "Отмена"}
                </Button>
                <Button onClick={handleOk}>
                    {props.acceptText ?? "Выполнить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
