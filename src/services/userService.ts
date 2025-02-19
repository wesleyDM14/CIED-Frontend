import axios from "axios";
import { User, Usuario } from "../contexts/interfaces";

export const getUsuarios = async (user: User, setUsuarios: (usuarios: Usuario[]) => void, setLoading: (loading: boolean) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/users`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setUsuarios(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setLoading(false);
    });
}

export const getProfile = async (user: User, setProfile: (profile: Usuario) => void, setLoading: (loading: boolean) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setProfile(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setLoading(false);
    });
}

export const createUser = async (usuario: Usuario, user: User, setLoading: (loading: boolean) => void, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeAddModal: () => void) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/create`, usuario, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Usuário cadastrado com sucesso!');
        setLoading(true);
        closeAddModal();
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('email', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const updateUser = async (usuario: Usuario, user: User, setLoading: (loading: boolean) => void, setFieldError: (field: string, message: string) => void, setSubmitting: (submitting: boolean) => void, closeEditModal?: () => void) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/user/${usuario.email}`, usuario, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        window.alert(data.message);
        setLoading(true);
        if (closeEditModal) {
            closeEditModal();
        }
    }).catch((err) => {
        console.error(err.response.data.error);
        setFieldError('email', err.response.data.error);
    }).finally(() => {
        setSubmitting(false);
    });
}

export const deleteUser = async (email: string, user: User, setDeleting: (deleting: boolean) => void, setLoading: (loading: boolean) => void, closeDeleteModal: () => void) => {
    setDeleting(true);
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/user/user/${email}`, {
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
