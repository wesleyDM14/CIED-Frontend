import styled from 'styled-components';
import { colors } from '../../utils/GlobalStyles';

interface ButtonProps {
    $cancel?: boolean;
}

export const AtendimentoContainer = styled.div`
    padding: 2rem;
    background-color: ${colors.background};
    min-height: 100vh;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 35px;

    @media only screen and (max-width: 978px){
        padding: 0;
    }
`

export const Title = styled.h1`
    display: flex;
    align-items: center;
    font-size: 20px;
    color: ${colors.title};
    font-weight: 700;

    svg {
        margin-right: 5px;
    }

    @media only screen and (max-width: 978px){
        font-size: 18px;
    }
`;


export const QueueContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 10px;
`;

export const QueueSection = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    max-height: 50vh;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
`;

export const SectionTitle = styled.h2`
    color: ${colors.title};
    margin-bottom: 0.5rem;
`;

export const QueueList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const QueueItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid ${colors.slimGray};
    
    &:last-child {
        border-bottom: none;
    }
`;

export const CallButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${colors.btnPrimary};
    color: ${colors.title};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
    
    &:hover {
        background-color: ${colors.hover};
    }
`;

export const AutoCallButton = styled.button`
    padding: 0.75rem;
    background-color: ${colors.btnSecondary};
    color: ${colors.white};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;

    &:hover {
        background-color: ${colors.hover};
        color: ${colors.mainText};
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

export const CounterSelect = styled.select`
    padding: 12px;
    border: 2px solid ${colors.btnPrimary};
    border-radius: 8px;
    font-size: 1.1rem;
    width: 100%;
    margin: 1rem 0;
    background: white;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${colors.btnPrimary}33;
    }
`;

export const ModalHeader = styled.h2`
    color: ${colors.btnPrimary};
    margin-bottom: 1.5rem;
    text-align: center;
`;

export const FormGroup = styled.div`
    margin-bottom: 1rem;
    
    label {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    input, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

export const ErrorText = styled.div`
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Button = styled.button<ButtonProps>`
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    background-color: ${props => props.$cancel ? '#e74c3c' : '#3498db'};
    color: white;
    margin-left: 1rem;

    &:hover {
        opacity: 0.9;
    }
`;