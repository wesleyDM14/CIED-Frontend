import styled from "styled-components";
import { colors } from "../../utils/GlobalStyles";
import MaskedInput from 'react-text-mask';

interface StyledIconProps {
    $right?: boolean;
}

export const InputContainer = styled.div`
    position: relative;
    width: 80%;
    display: block;
`;

export const FormInputContainer = styled.div`
    position: relative;
`;

export const InputLabel = styled.label`
    color: ${colors.white};

    &::after {
        display: inline-block;
        content: "*";
        margin-left: 2px;
        color: ${colors.red};
    }
`;

export const StyledIcon = styled.div<StyledIconProps>`
    position: absolute;
    margin: auto;
    top: 35%;
    color: ${colors.icon};
    font-size: 25px;
    ${(props) => props.$right && `right: 15px;`};
    ${(props) => !props.$right && `left: 15px;`};

    @media only screen and (max-width: 978px){
        top: 40%;
        font-size: 18px;
        ${(props) => props.$right && `right: 15px;`};
        ${(props) => !props.$right && `left: 15px;`};
    }
`;

export const ErrorMsg = styled.div`
    font-size: 11px;
    color: ${colors.red};
`;

export const FormTextInput = styled.input`
    width: 100%;
    padding: 10px 2px;
    font-size: 17px;
    letter-spacing: 1px;
    color: ${colors.mainText};
    background-color:${colors.background};
    border-radius: 5px;
    border: 0;
    outline: 0;
    display: block;
    margin: 5px 0 10px 0;
    transition: ease-in-out 0.3s;
    position: relative;

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    @media only screen and (max-width: 978px){
        margin: 5px 0;
    }
`;

export const StyledMaskInput = styled(MaskedInput)`
    width: 100%;
    padding: 10px 2px;
    font-size: 17px;
    letter-spacing: 1px;
    color: ${colors.mainText};
    background-color:${colors.background};
    border-radius: 5px;
    border: 0;
    outline: 0;
    display: block;
    margin: 5px 0 10px 0;
    transition: ease-in-out 0.3s;

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    @media only screen and (max-width: 978px){
        margin: 5px 0;
    }
`;

export const StyledInput = styled.input.attrs<{ $invalid?: boolean }>((props) => ({
    "aria-invalid": props.$invalid ? "true" : "false",
})) <{ $invalid?: boolean }>`
    width: 100%;
    padding: 15px;
    padding-left: 50px;
    font-size: 17px;
    letter-spacing: 1px;
    color: ${colors.mainText};
    background-color: ${colors.white};
    border: ${(props) => (props.$invalid ? `2px solid ${colors.red}` : "0")};
    outline: 0;
    display: block;
    margin: 5px auto 10px auto;
    transition: ease-in-out 0.3s;

    @media only screen and (max-width: 978px){
        width: 80%;
    }
`;