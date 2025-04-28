import axios, { AxiosError } from "axios";
import { Ticket, User } from "../contexts/interfaces";

export const createTicket = async (user: User, tipo: 'NORMAL' | 'PREFERENCIAL', procedimentoId: string): Promise<Ticket> => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/tickets/loggedCreate`, {
            type: tipo,
            procedimentoId
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`
            }
        });

        return response.data as Ticket;
    } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        console.error(error.response?.data?.error || error.message);
        window.alert(error.response?.data?.error || 'Erro ao criar ticket');
        throw error;
    }
};

export const printTicket = async (ticket: Ticket) => {
    const printWindow = window.open('', '_blank', 'width=300,height=600');

    if (printWindow) {
        const createdAt = ticket.createdAt ? new Date(ticket.createdAt) : new Date();

        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        const atendimentoTipo = ticket.type === 'PREFERENCIAL'
            ? 'Atendimento Preferencial'
            : 'Atendimento Normal';

        printWindow.document.write(`
             <html>
                <head>
                    <title>Imprimir Senha</title>
                    <style>
                        body {
                            width: 80mm;
                            margin: 0 auto;
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 20px;
                        }
                        .title {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .datetime {
                            font-size: 12px;
                            margin-bottom: 20px;
                        }
                        .code {
                            font-size: 48px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                        .type {
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                        .message {
                            font-size: 14px;
                            margin-top: 30px;
                        }
                    </style>
                </head>
                <body>
                    <div class="title">CIED - Complexo Hospitalar</div>
                    <div class="datetime">${formattedDate} - ${formattedTime}</div>
                    <div class="code">${ticket.code}</div>
                    <div class="type">${atendimentoTipo}</div>
                    <div class="message">Aguarde sua vez. Obrigado pela sua visita!</div>

                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    </script>
                </body>
            </html>
            `);
        printWindow.document.close();
    } else {
        window.alert('Erro ao abrir janela de impressão');
    }
}