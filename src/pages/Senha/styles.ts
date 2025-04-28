import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const SenhaContainer = styled.div`
    grid-area: main;
    display: block;

    @media only screen and (max-width: 978px){
        padding: 0 10px;
    }
`;

export const SenhaHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 35px;

    @media only screen and (max-width: 978px){
        padding: 0;
    }
`;

export const SenhaTitle = styled.h1`
    display: flex;
    align-items: center;
    font-size: 26px;
    color: ${colors.title};
    font-weight: 700;

    svg {
        margin-right: 5px;
    }

    @media only screen and (max-width: 978px){
        font-size: 18px;
    }
`;

export const SenhaContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

export const SenhaContentSubtitle = styled.h2`
    font-size: 22px;
    color: ${colors.title};
    margin-bottom: 15px;
    font-weight: 600;
    text-align: center;
`;

export const ProcedimentoCardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

export const ProcedimentoCard = styled.div`
    background-color: ${colors.white};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
    }
`;

export const ProcedimentoCardTitle = styled.h3`
    font-size: 18px;
    color: ${colors.title};
    font-weight: 600;
    margin-bottom: 10px;
`;

export const ProcedimentoCardProfissional = styled.h4`
    font-size: 16px;
    color: ${colors.description};
    font-weight: 500;
`;

export const NoProcedimentosFound = styled.p`
    font-size: 16px;
    color: ${colors.red};
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
`;

export const ModalContent = styled.div`
    padding: 20px;
    max-width: 400px;
    text-align: center;
    background-color: ${colors.white};
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h2`
    font-size: 22px;
    color: ${colors.title};
    margin-bottom: 15px;
`;

export const ModalText = styled.p`
    font-size: 16px;
    color: ${colors.description};
    margin-bottom: 20px;
`;

export const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`;

export const ModalButton = styled.button`
    background-color: ${colors.btnSecondary};
    color: ${colors.white};
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${colors.hover};
        color: ${colors.btnSecondary};
    }

    svg {
        margin-right: 8px;
    }
`;
