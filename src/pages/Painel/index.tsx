import { useEffect, useState } from "react";
import {
    AdPanel,
    LastCallItem,
    LastCalls,
    LastCallsTitle,
    PanelContainer,
    SenhaDisplay,
} from "./styles";
import { colors } from "../../utils/GlobalStyles";

const Painel: React.FC = () => {
    // Dados fictícios
    const [currentSenha, setCurrentSenha] = useState('N001');
    const [lastCalls, setLastCalls] = useState<string[]>(['N000', 'P002', 'N002']);

    useEffect(() => {
        if ('speechSynthesis' in window && currentSenha) {
            const synth = window.speechSynthesis;
            let voices = synth.getVoices();

            // Função para selecionar uma voz feminina
            const getFemaleVoice = () => {
                return voices.find(voice =>
                    voice.lang.includes("pt") &&
                    (voice.name.toLowerCase().includes("female") ||
                        voice.name.toLowerCase().includes("mulher") ||
                        voice.name.toLowerCase().includes("brasil"))
                ) || voices[0]; // Fallback para a primeira voz caso nenhuma feminina seja encontrada
            };

            const speak = () => {
                const utterance = new SpeechSynthesisUtterance(`Senha ${currentSenha}`);
                utterance.voice = getFemaleVoice();
                utterance.lang = "pt-BR"; // Configura para português do Brasil
                utterance.rate = 1.0; // Velocidade normal
                synth.speak(utterance);
            };

            // Algumas vezes as vozes ainda não foram carregadas
            if (voices.length === 0) {
                synth.onvoiceschanged = () => {
                    voices = synth.getVoices();
                    speak();
                };
            } else {
                speak();
            }
        }
    }, [currentSenha]);

    return (
        <PanelContainer>
            <SenhaDisplay>{currentSenha}</SenhaDisplay>
            <AdPanel>
                {/* Aqui você pode inserir um componente de vídeo ou carousel */}
                <p style={{ color: colors.mainText }}>Propaganda / Vídeo / Carousel</p>
            </AdPanel>
            <LastCalls>
                <LastCallsTitle>Últimas Chamadas</LastCallsTitle>
                <ul>
                    {lastCalls.map((senha, index) => (
                        <LastCallItem key={index}>{senha}</LastCallItem>
                    ))}
                </ul>
            </LastCalls>
        </PanelContainer>
    );
}

export default Painel;