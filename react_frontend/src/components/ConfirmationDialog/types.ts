import { ReactNode } from "react";

export interface ConfirmationDialogProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    title: string;
    description: ReactNode;
    cancelText?: string;
    acceptText?: string;
    onClose: (value?: boolean) => void;
}
