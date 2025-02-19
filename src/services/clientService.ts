import axios from "axios";
import { Cliente, User } from "../contexts/interfaces";

export const getClients = async (user: User, setClients: (clients: Cliente[]) => void, setLoading: (loading: boolean) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/clients/clientes`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setClients(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setLoading(false);
    });
}

export const createClient = async (client: Cliente, user: User, setLoading: (loading: boolean) => void, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeAddModal: () => void) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/clients/create`, client, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Cliente cadastrado com sucesso!');
        setLoading(true);
        closeAddModal();
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('name', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const updateClient = async (client: Cliente, user: User, setLoading: (loading: boolean) => void, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeEditModal: () => void) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/clients/cliente/${client.id}`, client, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        window.alert(data.message);
        setLoading(true);
        closeEditModal();
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('name', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const deleteClient = async (clientId: string, user: User, setDeleting: (deleting: boolean) => void, setLoading: (loading: boolean) => void, closeDeleteModal: () => void) => {
    setDeleting(true);
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/clients/cliente/${clientId}`, {
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