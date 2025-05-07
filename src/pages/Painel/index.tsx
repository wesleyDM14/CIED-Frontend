import { useEffect, useState } from "react";
import {
    AdContent,
    AdPanel,
    FadeAnimation,
    GuicheDisplay,
    HeaderSenha,
    LastCallItem,
    LastCalls,
    LastCallsTitle,
    PanelContainer,
    SenhaDisplay,
} from "./styles";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL);

const ads: string[] = ["/ads/ad1.jpg", "/ads/ad2.jpg", "/ads/ad3.mp4", "/ads/ad4.jpg", "/ads/ad5.jpg"];

const Painel: React.FC = () => {

    const [currentTicket, setCurrentTicket] = useState<{ number: string; serviceCounter: string } | null>(null);
    const [lastCalls, setLastCalls] = useState<{ number: string; serviceCounter: string }[]>([]);
    const [userInteracted, setUserInteracted] = useState(false);
    const [adIndex, setAdIndex] = useState(0);

    const currentAd = ads[adIndex];
    const isVideo = currentAd.endsWith(".mp4") || currentAd.endsWith(".webm");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (!isVideo) {
            timeout = setTimeout(() => {
                setAdIndex((prev) => (prev + 1) % ads.length);
            }, 10000);
        }
        return () => clearTimeout(timeout);
    }, [isVideo, adIndex]);

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
                }, 3000);
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
                            <small> Guichê: {ticket.serviceCounter}</small>
                        </LastCallItem>
                    ))}
                </ul>
            </LastCalls>
        </PanelContainer>
    );
}

export default Painel;