import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const DashboardContainer = styled.div`
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

export const SummaryWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1rem 0;
    justify-content: center;
    flex-wrap: wrap;
`;

export const SummaryCard = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.slimGray};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
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