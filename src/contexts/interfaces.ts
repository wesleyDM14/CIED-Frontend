import { useNavigate } from "react-router-dom";

export interface User {
    accessToken: string | null;
    userRole: string | null;
}

export interface Usuario {
    id?: string;
    email?: string;
    password?: string;
}

export interface PageProps {
    navigate?: ReturnType<typeof useNavigate>;
    user?: { accessToken: string | null; userRole: string | null };
}

export interface Cliente {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}