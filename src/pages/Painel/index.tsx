import { useEffect, useState } from "react";
import {
    AdContent,
    AdPanel,
    DataContainer,
    FadeAnimation,
    GuicheDisplay,
    HeaderSenha,
    HoraContainer,
    LastCallItem,
    LastCalls,
    LastCallsTitle,
    LogoContainer,
    LogoImg,
    PanelContainer,
    SenhaDisplay,
    TimeInfoContainer,
} from "./styles";
import logo from '../../assets/CIED.png';
import { io } from "socket.io-client";
import { FiCalendar, FiClock } from "react-icons/fi";

const socket = io(import.meta.env.VITE_BASE_URL);

const ads: string[] = ["/ads/ad6.mp4", "/ads/ad8.jpg"];

const Painel: React.FC = () => {

    const [currentTicket, setCurrentTicket] = useState<{ number: string; serviceCounter: string } | null>(null);
    const [lastCalls, setLastCalls] = useState<{ number: string; serviceCounter: string }[]>([]);
    const [userInteracted, setUserInteracted] = useState(false);
    const [adIndex, setAdIndex] = useState(0);

    const currentAd = ads[adIndex];
    const isVideo = currentAd.endsWith(".mp4") || currentAd.endsWith(".webm");

    const [dataAtual, setDataAtual] = useState('');
    const [horaAtual, setHoraAtual] = useState('');

    useEffect(() => {
        const atualizarDataHora = () => {
            const agora = new Date();
            const opcoesData: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
            const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            setDataAtual(dataFormatada);
            setHoraAtual(horaFormatada);
        };

        atualizarDataHora();
        const intervalo = setInterval(atualizarDataHora, 1000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (!isVideo) {
            timeout = setTimeout(() => {
                setAdIndex((prev) => (prev + 1) % ads.length);
            }, 60000);
        }
        return () => clearTimeout(timeout);
    }, [isVideo, adIndex]);

    useEffect(() => {
        const handleInteraction = () => {
            setUserInteracted(true);
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };

        document.addEventListener("click", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);
        document.addEventListener("keydown", handleInteraction);

        return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };
    }, []);

    useEffect(() => {
        socket.on("ticket:called", (ticket: { number: string; serviceCounter: string }) => {
            setCurrentTicket(ticket);
            setLastCalls(prev => {
                const alreadyExists = prev.some(t => t.number === ticket.number);
                if (alreadyExists) return prev;
                return [ticket, ...prev.slice(0, 4)];
            });
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
                return (
                    voices.find(voice =>
                        voice.lang.includes("pt") &&
                        (voice.name.toLowerCase().includes("female") ||
                            voice.name.toLowerCase().includes("mulher") ||
                            voice.name.toLowerCase().includes("brasil"))
                    ) || voices[0]
                );
            };

            const speak = () => {
                const senha = currentTicket.number;

                const letras = senha
                    .replace(/[0-9]/g, '')
                    .split('')
                    .map(l => {
                        const upper = l.toUpperCase();
                        if (upper === 'E') return 'É';
                        if (upper === 'O') return 'Ó';
                        return upper;
                    })
                    .join(' ');

                const numeros = senha.replace(/[^\d]/g, '');

                const voice = getFemaleVoice();

                const fullText = `Senha ${letras} ${numeros}, guichê ${currentTicket.serviceCounter}`;
                const utterance = new SpeechSynthesisUtterance(fullText);
                utterance.voice = voice;
                utterance.lang = "pt-BR";
                utterance.rate = 1.1;

                synth.speak(utterance);
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
            <LogoContainer>
                <LogoImg src={logo} alt="Logo Cied" />
            </LogoContainer>
            <HeaderSenha>
                <GuicheDisplay>Senha:</GuicheDisplay>
                {currentTicket && (
                    <SenhaDisplay>{currentTicket.number}</SenhaDisplay>
                )}
                {currentTicket && (
                    <GuicheDisplay>Guichê: {currentTicket.serviceCounter}</GuicheDisplay>
                )}
            </HeaderSenha>
            <AdPanel>
                <FadeAnimation key={adIndex}>
                    {
                        isVideo ? (
                            <AdContent as="video"
                                src={currentAd}
                                autoPlay
                                muted
                                playsInline
                                onEnded={() => setAdIndex((prev) => (prev + 1) % ads.length)}
                            />
                        ) : (
                            <AdContent as="img" src={currentAd} alt="Publicidade" />
                        )
                    }
                </FadeAnimation>
            </AdPanel>
            <LastCalls>
                <LastCallsTitle>Últimas Chamadas</LastCallsTitle>
                <ul>
                    {lastCalls.map((ticket, index) => (
                        <LastCallItem key={index}>
                            <span>Senha: {ticket.number}</span>
                        </LastCallItem>
                    ))}
                </ul>
            </LastCalls>
            <TimeInfoContainer>
                <DataContainer>
                    <FiCalendar />
                    {dataAtual}
                </DataContainer>
                <HoraContainer>
                    <FiClock />
                    {horaAtual}
                </HoraContainer>
            </TimeInfoContainer>
        </PanelContainer>
    );
}

export default Painel;