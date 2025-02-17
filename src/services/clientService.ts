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