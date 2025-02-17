import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: ${colors.background};
`;

export const Title = styled.h1`
    font-size: 3.5rem;
    color: ${colors.title};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

export const IconWrapper = styled.div`
    font-size: 4rem;
    color: ${colors.icon};
    margin-right: 15px;
`;

export const Message = styled.p`
    font-size: 1.5rem;
    color: ${colors.mainText};
    max-width: 600px;
    text-align: center;
    margin-bottom: 30px;
`;

export const BackButton = styled.button`
    padding: 12px 24px;
    background-color: ${colors.btnPrimary};
    color: #fff;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: ${colors.hover};
        transform: scale(1.05);
    }

    svg {
        margin-right: 10px;
    }
`;