import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Content,
    Description,
    FirstColumn,
    FormArea,
    HomeContainer,
    Icon,
    IconsContainer,
    Logo,
    SecondColumn,
    Title,
} from "./styles";
import { Form, Formik } from "formik";
import { LoginInput } from "../../components/FormLib";
import { FaFileContract, FaLock, FaMailBulk } from "react-icons/fa";
import logo from '../../assets/CIED.png';
import { colors } from "../../utils/GlobalStyles";
import { FaKitMedical, FaUsersLine } from "react-icons/fa6";
import * as Yup from 'yup';
import Loading from "../../components/Loading";
import { loginUser } from "../../services/authService";

const Home = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <HomeContainer>
            {
                !isLoading ? (
                    <Content>
                        <FirstColumn>
                            <Logo src={logo} alt='Logo da Empresa' />
                            <Title color={colors.mainText}>Bem Vindo de Volta!</Title>
                            <Description>Ao seu sistema de atendimento</Description>
                        </FirstColumn>
                        <SecondColumn>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Title>Acesse sua conta</Title>
                            </div>
                            <IconsContainer>
                                <Icon><FaUsersLine /></Icon>
                                <Icon><FaFileContract /></Icon>
                                <Icon><FaKitMedical /></Icon>
                            </IconsContainer>
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                }}
                                validationSchema={
                                    Yup.object({
                                        email: Yup.string().email("Digite um email válido").required('Obrigatório'),
                                        password: Yup.string().required('Senha é obrigatório.'),
                                    })
                                }
                                onSubmit={(values) => {
                                    loginUser(values, navigate, setIsLoading, dispatch);
                                }}
                            >
                                {
                                    () => (
                                        <Form>
                                            <FormArea>
                                                <LoginInput
                                                    name="email"
                                                    type="text"
                                                    label="Email"
                                                    icon={<FaMailBulk />}
                                                />
                                                <LoginInput
                                                    name="password"
                                                    type="password"
                                                    label="Senha"
                                                    icon={<FaLock />}
                                                />
                                                <Button type="submit">Entrar</Button>
                                            </FormArea>
                                        </Form>
                                    )
                                }
                            </Formik>
                        </SecondColumn>
                    </Content>
                ) : (
                    <Loading />
                )
            }
        </HomeContainer>
    );
};

export default Home;