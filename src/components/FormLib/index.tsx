import { useField } from "formik"
import { useState } from "react";
import {
    ErrorMsg,
    InputContainer,
    InputLabel,
    StyledIcon,
    StyledInput,
} from "./styles";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface LoginInputProps {
    icon: React.ReactElement; // Tipo para o ícone, que é um componente React do react-icons
    label: string;
    type: string;
    id?: string;
    name?: string;
}

export const LoginInput: React.FC<LoginInputProps> = ({ icon, ...props }) => {
    const [field, meta] = useField(props);
    const [show, setShow] = useState(false);

    const id = props.id || props.name;

    return (
        <InputContainer>
            <InputLabel htmlFor={id}>{props.label}</InputLabel>
            {
                props.type !== 'password' && (
                    <StyledInput
                        id={id}
                        $invalid={meta.touched && meta.error}
                        {...field}
                        {...props}
                    />
                )
            }
            {
                props.type === 'password' && (
                    <StyledInput
                        id={id}
                        $invalid={meta.touched && meta.error}
                        {...field}
                        {...props}
                        type={show ? "text" : "password"}
                    />
                )
            }
            <StyledIcon>
                {icon}
            </StyledIcon>
            {
                props.type === 'password' && (
                    <StyledIcon onClick={() => setShow(!show)} $right style={{ cursor: 'pointer' }}>
                        {show && <FiEye />}
                        {!show && <FiEyeOff />}
                    </StyledIcon>
                )
            }
            {
                meta.touched && meta.error ? (
                    <ErrorMsg>{meta.error}</ErrorMsg>
                ) : (
                    <ErrorMsg style={{ visibility: 'hidden' }}>.</ErrorMsg>
                )
            }
        </InputContainer>
    );
};