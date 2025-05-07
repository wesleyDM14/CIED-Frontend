import axios from "axios";
import { QueueItemInterface, User } from "../contexts/interfaces";

export const getTicketsQueue = async (user: User, setQueues: React.Dispatch<React.SetStateAction<QueueItemInterface[]>>) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tickets/queue`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`
            }
        });
        setQueues(response.data);
    } catch (error) {
        console.error('Erro ao buscar filas: ', error);
    }
}

export const callSpecificTicket = async (user: User, number: string, serviceCounter: string, setSelectedSenha: (number: string) => void, setModalOpen: (open: boolean) => void) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/tickets/call-specific`, { number, serviceCounter }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setSelectedSenha(data.number);
        setModalOpen(true);
    }).catch((err) => {
        console.error(err.response.data.error);
    });
}