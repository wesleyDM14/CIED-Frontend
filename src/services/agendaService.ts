import axios from "axios";
import { ProcedimentoToSave, Schedule, User } from "../contexts/interfaces";

export const registraAgendaDiaria = async (user: User, date: Date, procedimentos: ProcedimentoToSave[], closeModal: () => void, setLoading: (loading: boolean) => void) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/agendamento/diaria`, {
        date,
        procedimentos,
    }, {
        headers: {
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Agenda cadastrada com sucesso!');
        closeModal();
        setLoading(true);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    });
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

export const removerProcedimentoAgenda = async (user: User, scheduleId: string, procedimentoId: string, setLoading: (loading: boolean) => void) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/agendamento/procedimento/${scheduleId}/${procedimentoId}`, {
        headers: {
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        window.alert('Procedimento removido com sucesso.');
        setLoading(true);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    });
};

export const acrescentarProcedimentoAgenda = async (
    user: User,
    scheduleId: string,
    procedimentoId: string
) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/agenda/procedimento`,
            { scheduleId, procedimentoId },
            {
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar procedimento:', error);
        throw error;
    }
};