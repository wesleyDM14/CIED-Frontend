import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const PanelContainer = styled.div`
    padding: 1rem;
    background-color: ${colors.background};
    min-height: 95vh;
    display: grid;
    grid-template-areas: 
        "senha senha"
        "ad last";
    grid-template-columns: 2fr 0.5fr;
    grid-template-rows: 0.5fr 3fr;
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-areas:
        "senha"
        "ad"
        "last";
        grid-template-columns: 1fr;
    }
`;

export const LastCalls = styled.div`
    grid-area: last;
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow-y: auto;
`;

export const AdPanel = styled.div`
    grid-area: ad;
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const LastCallsTitle = styled.h3`
    text-align: center;
    color: ${colors.title};
    margin-bottom: 1rem;
    font-size: 30px;
`;

export const LastCallItem = styled.li`
    margin: 0.5rem 0;
    color: ${colors.mainText};
    margin-left: 1rem;
    font-weight: bold;
    font-size: 22px;
`;

export const SenhaDisplay = styled.div`
    display: flex;
    font-size: 9rem;
    font-weight: bold;
    color: ${colors.mainText};
    margin: 2rem 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

export const GuicheDisplay = styled.div`
    display: flex;
    font-size: 3rem;
    color: ${colors.btnSecondary};
    align-self: flex-end;
    margin-bottom: 2rem;
`;

export const HeaderSenha = styled.div`
    grid-area: senha;
    display: flex;
    justify-content: center;
`;