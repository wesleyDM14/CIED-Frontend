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
    code?: string;
    type?: "NORMAL" | "PREFERENCIAL";
    status?: "WAITING" | "CALLED" | "FINISHED";
    serviceCounter?: string;
    createdAt?: Date;
    calledAt?: Date;
    scheduleAt?: Date;
    procedimentoId?: string;
    updatedAt?: Date;
    procedimento?: Procedimento
}

export interface Procedimento {
    id?: string;
    nomeProfissional?: string;
    description?: string;
}

export interface ScheduleProcedimento {
    id: string;
    procedimento: Procedimento;
}

export interface Schedule {
    id: string;
    date: Date;
    procedimentos: ScheduleProcedimento[];
}

export interface ProcedimentoToSave {
    procedimentoId: string;
}

export interface QueueItemInterface {
    procedimentoId: string;
    nome: string;
    profissional: string;
    normal: Ticket[];
    preferencial: Ticket[];
};