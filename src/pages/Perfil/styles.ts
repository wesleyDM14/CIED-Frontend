import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

export const Container = styled.div`
    max-width: 80%;
    margin: 2rem auto;
    padding: 2rem;
    background-color: ${colors.icon};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;

    @media only screen and (max-width: 978px) {
        max-width: 95%;
        padding: 5px;
        margin: 1rem auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

export const Title = styled.h1`
    font-size: 2.5rem;
    color: ${colors.title};
    margin-bottom: 1rem;

    @media only screen and (max-width: 978px) {
        font-size: 2rem;
    }
`;

export const Subtitle = styled.p`
    font-size: 1.2rem;
    color: ${colors.mainText};
    margin-bottom: 2rem;

    @media only screen and (max-width: 978px) {
        font-size: 1rem;
    }
`;

export const FormGroup = styled.div`
    margin-bottom: 1.5rem;
    text-align: left;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: ${colors.mainText};
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid ${colors.slimGray};
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
        border-color: ${colors.btnPrimary};
        box-shadow: 0 0 5px rgba(226, 194, 123, 0.5);
    }

    @media only screen and (max-width: 978px) {
        padding: 0.5rem;
        font-size: 0.9rem;
    }
`;

export const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
    color: ${colors.white};
    background-color: ${colors.btnPrimary};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${colors.hover};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media only screen and (max-width: 978px) {
        font-size: 1rem;
        padding: 0.5rem;
    }
`;