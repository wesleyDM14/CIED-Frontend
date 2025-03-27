import axios from "axios";
import { Schedule, User } from "../contexts/interfaces";

export const createAgendamento = () => {

}

export const getAgendamentoMensal = async (user: User, mes: number, ano: number, setAgendamentoMensal: (agendamentoMensal: Schedule[]) => void) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/agendamento/mensal`, {
        params: {
            month: mes,
            year: ano
        },
        headers: {
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        setAgendamentoMensal(data);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    });
}