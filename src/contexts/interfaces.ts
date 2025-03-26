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
    id?: string;          // Obrigatório apenas na resposta
    name: string;
    email?: string;
    phone?: string;
    cpf: string;
    rg?: string;
    dataNascimento?: Date | null;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    num?: number | null;
    createdAt?: Date;    // Deve ser opcional para criação
    updatedAt?: Date;
}

export interface Ticket {
    id?: string;
    number?: string;
    type?: "NORMAL" | "PREFERENCIAL";
    status?: "WAITING" | "CALLED" | "FINISHED";
    serviceCounter?: string;
    room?: string;
}

export interface Procedimento {
    id?: string;
    nome?: string;
    description?: string;
    preco?: number;
    metodoPagamento?: "DINHEIRO" | "PIX" | "CARTAO" | "CONVENIO" | "SUS";
    ticketNumber?: string;
}