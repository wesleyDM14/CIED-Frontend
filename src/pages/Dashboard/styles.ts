import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const DashboardContainer = styled.div`
    padding: 2rem;
    background-color: ${colors.background};
    min-height: 100vh;
`;

export const SummaryCard = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s;
    
    &:hover {
        transform: translateY(-5px);
    }
`;

export const CardTitle = styled.h2`
    font-size: 1.5rem;
    color: ${colors.title};
    margin-bottom: 0.5rem;
`;

export const CardValue = styled.p`
    font-size: 2rem;
    color: ${colors.btnSecondary};
`;

export const ChartContainer = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

export const ChartCard = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    flex: 1;
    min-width: 300px;
    height: 300px;
`;