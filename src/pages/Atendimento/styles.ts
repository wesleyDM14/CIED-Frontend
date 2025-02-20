import styled from 'styled-components';
import { colors } from '../../utils/GlobalStyles';

export const AtendimentoContainer = styled.div`
    padding: 2rem;
    background-color: ${colors.background};
    min-height: 100vh;
`;

export const QueueSection = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    color: ${colors.white};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
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
    &:hover {
        background-color: ${colors.hover};
    }
    margin-top: 1rem;
`;