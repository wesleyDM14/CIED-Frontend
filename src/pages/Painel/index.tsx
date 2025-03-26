import { useEffect, useState } from "react";
import {
    AdPanel,
    GuicheDisplay,
    HeaderSenha,
    LastCallItem,
    LastCalls,
    LastCallsTitle,
    PanelContainer,
    SenhaDisplay,
} from "./styles";
import { colors } from "../../utils/GlobalStyles";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL);

const Painel: React.FC = () => {

    const [currentTicket, setCurrentTicket] = useState<{ number: string; serviceCounter: string } | null>(null);
    const [lastCalls, setLastCalls] = useState<{ number: string; serviceCounter: string }[]>([]);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setUserInteracted(true);
            document.removeEventListener("click", handleInteraction);
        };

        document.addEventListener("click", handleInteraction);

        return () => {
            document.removeEventListener("click", handleInteraction);
        };
    }, []);

    useEffect(() => {
        socket.on("ticket:called", (ticket: { number: string; serviceCounter: string }) => {
            setCurrentTicket(ticket);
            setLastCalls(prev => [ticket, ...prev.slice(0, 4)]);
        });

        return () => {
            socket.off("ticket:called");
        };
    }, []);

    useEffect(() => {
        if (userInteracted && 'speechSynthesis' in window && currentTicket) {
            const synth = window.speechSynthesis;
            let voices = synth.getVoices();

            const getFemaleVoice = () => {
                return voices.find(voice =>
                    voice.lang.includes("pt") &&
                    (voice.name.toLowerCase().includes("female") ||
                        voice.name.toLowerCase().includes("mulher") ||
                        voice.name.toLowerCase().includes("brasil"))
                ) || voices[0];
            };

            const speak = () => {
                const utterance = new SpeechSynthesisUtterance(`Senha ${currentTicket.number} guichê ${currentTicket.serviceCounter}`);
                utterance.voice = getFemaleVoice();
                utterance.lang = "pt-BR";
                utterance.rate = 1.0;

                synth.speak(utterance);

                setTimeout(() => {
                    synth.speak(utterance);
                }, 3000); // Segunda chamada após 3 segundos
            };

            if (voices.length === 0) {
                synth.onvoiceschanged = () => {
                    voices = synth.getVoices();
                    speak();
                };
            } else {
                speak();
            }
        }
    }, [currentTicket, userInteracted]);

    return (
        <PanelContainer>
            {currentTicket && (
                <HeaderSenha>
                    <SenhaDisplay>{currentTicket.number}</SenhaDisplay>
                    <GuicheDisplay>Guichê: {currentTicket.serviceCounter}</GuicheDisplay>
                </HeaderSenha>
            )}
            <AdPanel>
                {/* Seu conteúdo de vídeo/animação */}
                <div style={{
                    backgroundColor: colors.background,
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ color: colors.mainText, textAlign: 'center' }}>Espaço para propaganda</p>
                </div>
            </AdPanel>
            <LastCalls>
                <LastCallsTitle>Últimas Chamadas</LastCallsTitle>
                <ul>
                    {lastCalls.map((ticket, index) => (
                        <LastCallItem key={index}>
                            <span>Senha: {ticket.number}</span>
                            <small> Guichê: {ticket.serviceCounter}</small>
                        </LastCallItem>
                    ))}
                </ul>
            </LastCalls>
        </PanelContainer>
    );
}

export default Painel;