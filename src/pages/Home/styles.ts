import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";

interface TitleProps {
    size?: number;
    color?: string;
}

interface DescriptionProps {
    $marginTop?: number;
}

export const HomeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: ${colors.white};
    position: relative;

    @media only screen and (max-width: 978px){
       display: block;
    }
`;

export const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    background-color: ${colors.background};
    height: 50%;
    border-radius: 15px;

    @media only screen and (max-width: 978px){
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
`;

export const FirstColumn = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.background};
    align-items: center;
    justify-content: center;
    padding: 45px;

    @media only screen and (max-width: 978px){
        height: 25vh;
    }
`;

export const SecondColumn = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.sidebar};
    justify-content: center;
    padding: 45px;

    @media only screen and (max-width: 978px){
        padding: 15px;
        height: 75vh;
    }
`;

export const Logo = styled.img`
    width: 200px;
    height: auto;
    margin: 5px;

    @media only screen and (max-width: 978px){
        width: 85px;
    }
`;

export const Title = styled.h2<TitleProps>`
    font-size: ${props => props.size ? `${props.size}px` : '28px'};
    color: ${props => props.color ? props.color : colors.white};
    font-weight: bold;
    text-transform: capitalize;

    @media only screen and (max-width: 978px){
        font-size: 18px;
    }
`;

export const Description = styled.p<DescriptionProps>`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.description};
    margin-top: ${props => props.$marginTop ? props.$marginTop : '0'};

    @media only screen and (max-width: 978px){
        font-size: 14px;
    }
`;

export const Button = styled.button`
    cursor: pointer;
    font-weight: 600;
    border: 1px solid ${colors.btnSecondary};
    border-radius: 4px;
    padding: 20px;
    width: 30%;
    transition: all .2s ease-out;
    background-color: ${colors.white};
    color: ${colors.mainText};
    margin-top: 15px;

    &:hover{
        background-color: ${colors.mainText};
        color: ${colors.white};
        border: 1px solid ${colors.white};
    }

    @media only screen and (max-width: 978px){
        width: 100%;
    }
`;

export const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-around;
`;

export const Icon = styled.a`
    color: ${colors.icon};
    font-size: 45px;
    margin-top: 15px;
    transition: transform 0.3s ease-in-out;

    &:hover{
        transform: scale(1.2);
    }

    @media only screen and (max-width: 978px){
        font-size: 30px;
    }
`;

export const FormArea = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
`;