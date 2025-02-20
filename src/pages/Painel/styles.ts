import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const PanelContainer = styled.div`
    padding: 1rem;
    background-color: ${colors.background};
    min-height: 80vh;
    display: grid;
    grid-template-areas: 
        "senha senha"
        "ad last";
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 3fr;
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-areas:
        "senha"
        "ad"
        "last";
        grid-template-columns: 1fr;
    }
`;

export const SenhaDisplay = styled.div`
    grid-area: senha;
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-size: 4rem;
    color: ${colors.title};
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
`;

export const LastCallItem = styled.li`
    margin: 0.5rem 0;
    color: ${colors.mainText};
`;