import axios from "axios";
import { Ticket, User } from "../contexts/interfaces";

export const getTicketsQueue = async (user: User, setNormalQueue: (normalQueue: Ticket[]) => void, setPreferencialQueue: (preferentialQueue: Ticket[]) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tickets/queue`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        const { ticketsNormal, ticketsPreferencial } = data;
        setNormalQueue(ticketsNormal);
        setPreferencialQueue(ticketsPreferencial);
    }).catch((err) => {
        console.error(err.response.data.error);
    });
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