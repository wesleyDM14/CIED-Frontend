import styled, { keyframes } from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const PanelContainer = styled.div`
    background-color: ${colors.background};
    height: 100vh;
    display: grid;
    grid-template-areas: 
        "logo senha"
        "ad senha"
        "ad last"
        "time time";
    grid-template-columns: 2fr 0.5fr;
    grid-template-rows: 0.5fr 1.5fr 3fr 0.5fr;

    @media (max-width: 768px) {
        grid-template-areas:
        "ad ad"
        "senha last";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 3fr 0.5fr;
    }
`;

export const LastCalls = styled.div`
    grid-area: last;
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow-y: auto;
    height: 100%;
`;

export const AdPanel = styled.div`
    grid-area: ad;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    position: relative;
`;

export const LastCallsTitle = styled.h3`
    text-align: center;
    color: ${colors.title};
    margin: 1rem 0;
    font-size: 30px;

    @media (max-width: 768px) {
        font-size: 0.5rem;
        margin: 0.1rem 0;
    }
`;

export const LastCallItem = styled.li`
    margin: 0.5rem 0;
    color: ${colors.mainText};
    margin-left: 2rem;
    font-weight: bold;
    font-size: 22px;

    @media (max-width: 768px) {
        font-size: 8px;
    }
`;

export const SenhaDisplay = styled.h1`
    font-size: 6rem;
    font-weight: bold;
    color: ${colors.white};
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const GuicheDisplay = styled.h5`
    font-size: 3rem;
    color: ${colors.white};

    @media (max-width: 768px) {
        font-size: 0.8rem;
    }
`;

export const HeaderSenha = styled.div`
    grid-area: senha;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.btnSecondary};
`;

export const AdContent = styled.div`
    width: 100%;
    height: 100%;

    video, img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
`;

export const FadeAnimation = styled.div`
    width: 100%;
    height: 100%;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

export const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    grid-area: logo;
`;

export const LogoImg = styled.img`
    width: 300px;
    height: auto;
    margin: 5px;
`;

export const TimeInfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: ${colors.btnSecondary};
    grid-area: time;
`;

export const DataContainer = styled.div`
    display: flex;
    align-items: center;
    font-size: 2rem;
    color: ${colors.white};
    margin-right: 2rem;

    svg {
        margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
        font-size: 0.8rem;
        margin-right: 1rem;
    }
`;

export const HoraContainer = styled.div`
    display: flex;
    align-items: center;
    font-size: 3rem;
    color: ${colors.white};
    font-weight: bold;

    svg {
        margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;