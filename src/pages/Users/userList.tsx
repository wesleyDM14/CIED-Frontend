import { useMemo, useState } from "react";
import { User, Usuario } from "../../contexts/interfaces";
import Modal from 'react-modal';
import {
    AdminContainer,
    BackButton,
    ButtonGroup,
    DeleteButtonContainer,
    DeleteContainer,
    DeleteIconContainer,
    DeleteTitle,
    EditIconContainer,
    FormContent,
    FormInputArea,
    FormInputLabelRequired,
    IconWrapper,
    Limitador,
    SingleUser,
    StyledFormArea,
    SubItensContainer,
    SubmitButton,
    UserLabel,
    UserListContainer,
    UserListHeader,
    UserListHeaderLabel,
    UserTitle,
    UserValue,
    UserValueContainer,
} from "./styles";
import { FaEdit, FaFileInvoice, FaLock, FaMailBulk, FaTrashAlt } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { MdAlternateEmail } from "react-icons/md";
import { FormInput } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import { ImWarning } from "react-icons/im";
import { deleteUser, updateUser } from "../../services/userService";

interface UserListProps {
    usuarios: Usuario[];
    navigate: (path: string) => void;
    search: string;
    page: number;
    setPage: (page: number) => void;
    itensPerPage: number;
    setLoading: (loading: boolean) => void;
    user: User;
}

const UserList: React.FC<UserListProps> = ({ usuarios, navigate, search, page, setPage, itensPerPage, setLoading, user }) => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [selectedUser, setSelectedUser] = useState<Usuario>({});

    const [modalEditIsOpen, setModalEditIsOpen] = useState<boolean>(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState<boolean>(false);

    const [deleting, setDeleting] = useState(false);

    const openEditModal = () => setModalEditIsOpen(true);

    const closeEditModal = () => {
        setModalEditIsOpen(false);
        setSelectedUser({});
    };

    const openDeleteModal = () => setModalDeleteIsOpen(true);

    const closeDeleteModal = () => {
        setModalDeleteIsOpen(false);
        setSelectedUser({});
    };

    const filteredUsers = useMemo(
        () =>
            usuarios.filter((usuario) =>
                usuario.email?.toLowerCase().includes(search.toLowerCase())
            ),
        [usuarios, search]
    );

    const totalPages = Math.ceil(filteredUsers.length / itensPerPage);
    const currentPageItens = filteredUsers.slice((page - 1) * itensPerPage, page * itensPerPage);

    return (
        <UserListContainer>
            <UserListHeader>
                <UserListHeaderLabel className="first-label">Email</UserListHeaderLabel>
                <UserListHeaderLabel>Opções</UserListHeaderLabel>
            </UserListHeader>
            {
                currentPageItens.map((usuario) => (
                    <SingleUser key={usuario.id} onClick={() => navigate(`/`)}>
                        <UserValueContainer>
                            <UserLabel><FaMailBulk style={{ marginLeft: '5px' }} /></UserLabel>
                            <UserValue>{usuario.email}</UserValue>
                        </UserValueContainer>
                        <AdminContainer>
                            <EditIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedUser(usuario);
                                openEditModal();
                            }}>
                                <FaEdit />
                            </EditIconContainer>
                            <DeleteIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedUser(usuario);
                                openDeleteModal();
                            }}>
                                <FaTrashAlt />
                            </DeleteIconContainer>
                        </AdminContainer>
                    </SingleUser>
                ))
            }
            <Pagination currentPage={page} setPage={setPage} totalPages={totalPages} />
            <Modal
                isOpen={modalEditIsOpen}
                onRequestClose={closeEditModal}
                style={ModalStyles}
            >
                <StyledFormArea>
                    <div style={{ display: 'flex', marginBottom: '30px', alignItems: 'center', justifyContent: 'center' }}>
                        <UserTitle><FaFileInvoice />Editar Usuário</UserTitle>
                    </div>
                    <Formik
                        initialValues={{
                            id: selectedUser.id,
                            email: selectedUser.email,
                            newPassword: '',
                            confirmPassword: ''
                        }}
                        validationSchema={
                            Yup.object({
                                email: Yup.string().email('Digite um email válido').required('Email é Obrigatório'),
                                newPassword: Yup.string().required('Senha é obrigatório'),
                                confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), undefined], 'As senhas devem coincidir').required('Confirmação de senha é obrigatório'),
                            })
                        }
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            updateUser(values, user!, setLoading, setFieldError, setSubmitting, closeEditModal);
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
                                                    <FormInputLabelRequired><FaLock />Nova Senha</FormInputLabelRequired>
                                                    <FormInput
                                                        type='password'
                                                        name='newPassword'
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
                                            <BackButton type="button" onClick={closeEditModal}>
                                                Cancelar
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
                </StyledFormArea>
            </Modal>
            <Modal
                isOpen={modalDeleteIsOpen}
                onRequestClose={closeDeleteModal}
                style={ModalStyles}
            >
                <DeleteContainer>
                    <IconWrapper>
                        <ImWarning />
                    </IconWrapper>
                    <DeleteTitle>Deseja excluir o Usuário {selectedUser.email}?</DeleteTitle>
                    <DeleteButtonContainer>
                        <BackButton onClick={() => {
                            closeDeleteModal();
                        }}>
                            Cancelar
                        </BackButton>
                        {
                            deleting && (
                                <ThreeDots color={colors.icon} />
                            )
                        }
                        {
                            !deleting && (
                                <SubmitButton onClick={() => {
                                    deleteUser(selectedUser.email!, user!, setDeleting, setLoading, closeDeleteModal);
                                }}>
                                    Excluir
                                </SubmitButton>
                            )
                        }
                    </DeleteButtonContainer>
                </DeleteContainer>
            </Modal>
        </UserListContainer>
    );
}

export default UserList;