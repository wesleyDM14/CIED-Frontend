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