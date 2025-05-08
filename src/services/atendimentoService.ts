import axios from "axios";
import { QueueItemInterface, User } from "../contexts/interfaces";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

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
        setSelectedSenha(data.code);
        setModalOpen(true);
    }).catch((err) => {
        console.error(err.response.data.error);
    });
}

export const recalLastTicket = async (user: User, number: string, serviceCounter: string) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/tickets/call-specific`, { number, serviceCounter }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).catch((err) => {
        console.error(err.response.data.error);
    });
}

export function gerarFichaAtendimento(dados: {
    //os: string;
    dataHora: string;
    descricao: string;
    profissional: string;
    pagamento: string;
    paciente: string;
    nascimento: string;
    idade: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    telefone: string;
    cpf: string;
    rg: string;
    cep: string;
    uf: string;
    numero: string;
    convenio: string;
}) {
    const doc = new jsPDF();

    const margin = 10;
    let y = margin;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CIED - COMPLEXO HOSPITALAR', margin, y);
    /*doc.setFontSize(10);
    doc.text(`O.S: ${dados.os}`, 160, y);*/

    y += 8;
    doc.setLineWidth(0.5);
    doc.rect(margin, y, 190, 25);

    doc.setFontSize(11);
    doc.text('FICHA DE ATENDIMENTO', margin + 2, y + 5);

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Descrição: ${dados.descricao}`, margin + 2, y + 11);
    doc.text(`Profissional: ${dados.profissional}`, margin + 2, y + 16);
    doc.text(`Forma Pgto: ${dados.pagamento}`, margin + 2, y + 21);
    doc.text(`Data: ${dados.dataHora}`, 150, y + 5);

    y += 30;
    doc.rect(margin, y, 190, 30);
    doc.setFont('Helvetica', 'bold');
    doc.text('DADOS DO PACIENTE', margin + 2, y + 5);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Paciente: ${dados.paciente}`, margin + 2, y + 11);
    doc.text(`Nascimento: ${dados.nascimento}   Idade: ${dados.idade}`, margin + 2, y + 16);
    doc.text(`Logradouro: ${dados.logradouro}`, margin + 2, y + 21);
    doc.text(`Bairro: ${dados.bairro}`, margin + 2, y + 26);
    doc.text(`Cidade: ${dados.cidade}`, margin + 80, y + 26);
    doc.text(`Convênio: ${dados.convenio}`, margin + 130, y + 26);
    doc.text(`Telefone: ${dados.telefone}`, 140, y + 11);
    doc.text(`CPF: ${dados.cpf}`, 140, y + 16);
    doc.text(`RG: ${dados.rg}`, 140, y + 21);
    /*doc.text(`CEP: ${dados.cep}`, 140, y + 26);*/
    doc.text(`UF: ${dados.uf}`, 180, y + 26);
    doc.text(`Nº: ${dados.numero}`, 110, y + 21);

    // SINAIS VITAIS
    y += 35;
    doc.setFont('Helvetica', 'bold');
    doc.text('SINAIS VITAIS', margin + 2, y);

    autoTable(doc, {
        startY: y + 2,
        head: [[
            'Pressão Arterial', 'Frequência Cardíaca', 'Temp. °C', 'SpO2 (Saturação 02)',
            'Peso', 'Altura', 'IMC'
        ]],
        body: [['', '', '', '', '', '', '']],
        theme: 'grid',
        styles: { fontSize: 9, halign: 'center' },
        headStyles: { fillColor: [255, 255, 255], textColor: 0 },
        margin: { left: margin },
        tableWidth: 190
    });

    y = (doc as any).lastAutoTable.finalY + 4;

    const blocos = [
        'Queixa Principal:',
        'História Clínica:',
        'Exame Físico:',
        'Hipótese Diagnóstica:',
        'Conduta:'
    ];

    doc.setFontSize(10);
    blocos.forEach((titulo) => {
        doc.setFont('Helvetica', 'bold');
        doc.text(titulo, margin, y);
        y += 2;
        doc.setFont('Helvetica', 'normal');
        for (let i = 0; i < 3; i++) {
            doc.line(margin, y, 200, y);
            y += 6;
        }
    });

    /* Rodapé
    doc.setFontSize(8);
    doc.text(`Pixeon ${dados.dataHora}`, margin, 287);
    doc.text('Página 1 /', 180, 287);*/

    doc.save('ficha_atendimento.pdf');

}

export const finalizeTicket = async (user: User, ticketId: string, closeModal: () => void) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/api/tickets/finalize/${ticketId}`,{}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { data } = response;
        console.log(data);
        closeModal();
    }).catch((err) => {
        console.error(err.response.data.error);
    });
}
