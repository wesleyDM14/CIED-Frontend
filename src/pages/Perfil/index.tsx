import { Form, Formik } from "formik";
import {
    Container,
    Subtitle,
    Title,
} from "./styles";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { PageProps, Usuario } from "../../contexts/interfaces";
import { getProfile, updateUser } from "../../services/userService";
import Loading from "../../components/Loading";
import { BackButton, ButtonGroup, FormContent, FormInputArea, FormInputLabelRequired, Limitador, SubItensContainer, SubmitButton } from "../Users/styles";
import { FaLock } from "react-icons/fa";
import { FormInput } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import { colors } from "../../utils/GlobalStyles";

const Perfil: React.FC<PageProps> = ({ navigate, user }) => {

    const [profile, setProfile] = useState<Usuario>({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            getProfile(user!, setProfile, setLoading);
        }
    }, [loading, user]);

    return (
        <>
            {
                loading ? (
                    <Loading />
                ) : (
                    <Container>
                        <Title>Perfil de Usuário</Title>
                        <Subtitle>Altere sua senha abaixo</Subtitle>
                        <Formik
                            initialValues={{
                                id: profile.id,
                                email: profile.email,
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            }}
                            validationSchema={
                                Yup.object({
                                    currentPassword: Yup.string().required('Senha atual é obrigatório'),
                                    newPassword: Yup.string().required('A nova senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
                                    confirmPssword: Yup.string().oneOf([Yup.ref('newPassword')], 'As senhas devem coincidir.').required('A confirmação da nova senha é obrigatória'),
                                })
                            }
                            onSubmit={(values, { setSubmitting, setFieldError }) => {
                                updateUser(values, user!, setLoading, setFieldError, setSubmitting);
                            }}
                        >
                            {
                                ({ isSubmitting }) => (
                                    <Form>
                                        <FormContent>
                                            <SubItensContainer>
                                                <Limitador>
                                                    <FormInputArea>
                                                        <FormInputLabelRequired><FaLock />Senha</FormInputLabelRequired>
                                                        <FormInput
                                                            type='password'
                                                            name='password'
                                                            placeholder='Senha do Usuário'
                                                        />
                                                    </FormInputArea>
                                                </Limitador>
                                                <FormInputArea>
                                                    <FormInputLabelRequired><FaLock />Confirmar Senha</FormInputLabelRequired>
                                                    <FormInput
                                                        type='password'
                                                        name='confirmPassword'
                                                        placeholder='Confirmar Senha'
                                                    />
                                                </FormInputArea>
                                            </SubItensContainer>
                                            <ButtonGroup>
                                                <BackButton type="button" onClick={() => navigate!('/')}>
                                                    Voltar
                                                </BackButton>
                                                {
                                                    !isSubmitting && (
                                                        <SubmitButton type="submit">Atualizar</SubmitButton>
                                                    )
                                                }
                                                {
                                                    isSubmitting && (
                                                        <ThreeDots color={colors.icon} />
                                                    )
                                                }
                                            </ButtonGroup>
                                        </FormContent>
                                    </Form>
                                )
                            }
                        </Formik>
                    </Container>
                )
            }
        </>
    );
};

export default Perfil;