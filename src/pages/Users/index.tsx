import { useEffect, useState } from "react";
import { PageProps, Usuario } from "../../contexts/interfaces";
import Modal from 'react-modal';
import { createUser, getUsuarios } from "../../services/userService";
import {
    AddIcon,
    AddText,
    AddUserButton,
    AddUserContainer,
    BackButton,
    ButtonGroup,
    FormContent,
    FormInputArea,
    FormInputLabelRequired,
    IconWrapper,
    Limitador,
    NoContentActionContainer,
    NoContentContainer,
    StyledFormArea,
    SubItensContainer,
    SubmitButton,
    TextContent,
    UserContent,
    UserHeader,
    UsersContainer,
    UserTitle,
} from "./styles";
import Loading from "../../components/Loading";
import { FaFileInvoice, FaLock, FaPlus, FaPlusCircle, FaUsers } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import UserList from "./userList";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { MdAlternateEmail } from "react-icons/md";
import { FormInput } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";

const Users: React.FC<PageProps> = ({ navigate, user }) => {

    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const [modalAddIsOpen, setModalAddIsOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const openAddModal = () => {
        setModalAddIsOpen(true);
    }

    const closeAddModal = () => {
        setModalAddIsOpen(false);
    }

    useEffect(() => {
        if (loading) {
            getUsuarios(user!, setUsuarios, setLoading);
        }
    }, [user, loading]);

    return (
        <UsersContainer>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <UserHeader>
                            <UserTitle><FaUsers />Usuários</UserTitle>
                            <AddUserContainer onClick={openAddModal}>
                                <AddIcon>
                                    <FaPlusCircle />
                                </AddIcon>
                                <AddText>Adicionar Novo</AddText>
                            </AddUserContainer>
                        </UserHeader>
                        <UserContent>
                            <SearchBar search={search} setSearch={setSearch} />
                            {
                                usuarios.length === 0 ? (
                                    <NoContentContainer>
                                        <IconWrapper>
                                            <FaUsers />
                                        </IconWrapper>
                                        <NoContentActionContainer>
                                            <TextContent>Nenhum Usuário encontrado.</TextContent>
                                            <AddUserButton onClick={openAddModal}>
                                                <FaPlus color={colors.icon} fontSize={15} className="icon-add-button" /> Novo Usuário
                                            </AddUserButton>
                                        </NoContentActionContainer>
                                    </NoContentContainer>
                                ) : (
                                    <UserList
                                        usuarios={usuarios}
                                        itensPerPage={itemsPerPage}
                                        navigate={navigate!}
                                        page={page}
                                        search={search}
                                        setLoading={setLoading}
                                        setPage={setPage}
                                        user={user!}
                                    />
                                )
                            }
                        </UserContent>
                    </>
                )
            }
            <Modal
                isOpen={modalAddIsOpen}
                onRequestClose={closeAddModal}
                style={ModalStyles}
            >
                <StyledFormArea>
                    <div style={{ display: 'flex', marginBottom: '30px', alignItems: 'center', justifyContent: 'center' }}>
                        <UserTitle><FaFileInvoice />Cadastrar Usuário</UserTitle>
                    </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={
                            Yup.object({
                                email: Yup.string().email('Digite um email válido').required('Email é Obrigatório'),
                                password: Yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatório'),
                                confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'As senhas devem coincidir').required('Confirmação de senha é obrigatório'),
                            })
                        }
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            createUser(values, user!, setLoading, setFieldError, setSubmitting, closeAddModal);
                        }}
                    >
                        {
                            ({ isSubmitting }) => (
                                <Form>
                                    <FormContent>
                                        <FormInputArea>
                                            <FormInputLabelRequired><MdAlternateEmail />Email</FormInputLabelRequired>
                                            <FormInput
                                                type='text'
                                                name='email'
                                                placeholder='Email do Usuário'
                                                autoComplete='email'
                                            />
                                        </FormInputArea>
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
                                            <BackButton type="button" onClick={closeAddModal}>
                                                Cancelar
                                            </BackButton>
                                            {
                                                !isSubmitting && (
                                                    <SubmitButton type="submit">Cadastrar</SubmitButton>
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
                </StyledFormArea>
            </Modal>
        </UsersContainer>
    );
};

export default Users;