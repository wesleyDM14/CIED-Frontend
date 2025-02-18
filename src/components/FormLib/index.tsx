import { FieldHookConfig, useField } from "formik"
import { useState } from "react";
import {
    ErrorMsg,
    FormInputContainer,
    FormTextInput,
    InputContainer,
    InputLabel,
    StyledIcon,
    StyledInput,
    StyledMaskInput,
} from "./styles";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface LoginInputProps {
    icon: React.ReactElement;
    label: string;
    type: string;
    id?: string;
    name?: string;
}

interface MaskedInputProps extends FieldHookConfig<string> {
    name?: string;
    type?: string;
    value?: string | null;
    mask?: (string | RegExp)[]; // Defina o tipo de máscara corretamente
    placeholder?: string;
    autoComplete?: string;
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
                        $invalid={meta.touched && !!meta.error}
                        {...field}
                        {...props}
                    />
                )
            }
            {
                props.type === 'password' && (
                    <StyledInput
                        id={id}
                        $invalid={meta.touched && !!meta.error}
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

export const FormInput = ({ ...props }) => {

    const [field, meta] = useField(props);
    const [show, setShow] = useState(false);

    return (
        <FormInputContainer>
            {
                props.type !== 'password' && (
                    <FormTextInput
                        {...field}
                        {...props}
                    />
                )
            }
            {
                props.type === 'password' && (
                    <FormTextInput
                        {...field}
                        {...props}
                        type={show ? "text" : "password"}
                    />
                )
            }
            {
                props.type === 'password' && (
                    <StyledIcon onClick={() => setShow(!show)} $right style={{ cursor: 'pointer' }} className="eyeIcon">
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
        </FormInputContainer>
    );
}

export const MaskedInputComponent: React.FC<MaskedInputProps> = ({ mask, ...props }) => {
    const [field, meta, helpers] = useField(props);

    return (
        <>
            <StyledMaskInput
                {...field}
                mask={mask!}
                onChange={(event) => {
                    const rawValue = event.target.value.replace(/\D/g, '');
                    helpers.setValue(rawValue);
                }}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <ErrorMsg>{meta.error}</ErrorMsg>
            ) : (
                <ErrorMsg style={{ visibility: 'hidden' }}>.</ErrorMsg>
            )}
        </>
    );
}