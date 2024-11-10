import { ReactNode } from "react";

export interface AuthWrapperProps {
    title: string
    actions: ReactNode
    children?: ReactNode
}