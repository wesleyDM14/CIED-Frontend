import axios from "axios";
import { Procedimento, User } from '../contexts/interfaces';

export const createProcedimento = async (procedimento: Procedimento, user: User, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeModal: () => void, setLoading: (loading: boolean) => void) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/procedimentos/create`, procedimento, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Procedimento cadastrado com sucesso!');
        closeModal();
        setLoading(true);
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('description', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const getProcedimentos = async (user: User, setProcedimentos: (procedimentos: Procedimento[]) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/procedimentos/procedimentos`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setProcedimentos(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    });
}

export const getProcedimentosByClient = async (user: User, clientId: string, setProcedimentos: (procedimentos: Procedimento[]) => void, setLoading: (loading: boolean) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/procedimentos/client/${clientId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setProcedimentos(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setLoading(false);
    });
}

export const updateProcedimento = async (procedimento: Procedimento, user: User, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeModal: () => void, setLoading: (loading: boolean) => void) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/procedimentos/procedimento/${procedimento.id}`, procedimento, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Procedimento atualizado com sucesso!');
        closeModal();
        setLoading(true);
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('nome', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const deleteProcedimento = async (procedimentoId: string, user: User, setDeleting: (deleting: boolean) => void, setLoading: (loading: boolean) => void, closeDeleteModal: () => void) => {
    setDeleting(true);
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/procedimentos/procedimento/${procedimentoId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        window.alert(data.message);
        closeDeleteModal();
        setLoading(true);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setDeleting(false);
    });
}