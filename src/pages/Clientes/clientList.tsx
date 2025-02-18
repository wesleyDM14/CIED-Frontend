import { useMemo, useState } from "react";
import { Cliente, User } from "../../contexts/interfaces";
import {
    AdminContainer,
    BackButton,
    ButtonGroup,
    ClientLabel,
    ClientListContainer,
    ClientListHeader,
    ClientListHeaderLabel,
    ClientTitle,
    ClientValue,
    ClientValueContainer,
    DeleteButtonContainer,
    DeleteContainer,
    DeleteIconContainer,
    DeleteTitle,
    EditIconContainer,
    FormContent,
    FormInputArea,
    FormInputLabel,
    FormInputLabelRequired,
    IconWrapper,
    SingleClient,
    StyledFormArea,
    SubmitButton,
} from "./styles";
import Pagination from "../../components/Pagination";
import { FaEdit, FaFileInvoice, FaMapPin, FaPhoneAlt, FaTrashAlt, FaUser, FaWhatsapp } from "react-icons/fa";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import Modal from 'react-modal';
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { MdAlternateEmail, MdDriveFileRenameOutline } from "react-icons/md";
import { ImWarning } from 'react-icons/im';
import { FormInput, MaskedInputComponent } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";

interface ClientListProps {
    clients: Cliente[];
    navigate: (path: string) => void;
    search: string;
    page: number;
    setPage: (page: number) => void;
    itensPerPage: number;
    setLoading: (loading: boolean) => void;
    user: User;
}

const ClientList: React.FC<ClientListProps> = ({ clients, navigate, search, page, setPage, itensPerPage, setLoading, user }) => {
    const [selectedClient, setSelectedClient] = useState<Cliente>({});

    const [modalEditIsOpen, setModalEditIsOpen] = useState<boolean>(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState<boolean>(false);

    const openEditModal = () => setModalEditIsOpen(true);

    const closeEditModal = () => {
        setModalEditIsOpen(false);
        setSelectedClient({});
    };

    const openDeleteModal = () => setModalDeleteIsOpen(true);

    const closeDeleteModal = () => {
        setModalDeleteIsOpen(false);
        setSelectedClient({});
    };

    const filteredClients = useMemo(
        () =>
            clients.filter((client) =>
                client.name?.toLowerCase().includes(search.toLowerCase()) ||
                client.phone?.toLowerCase().includes(search.toLowerCase()) ||
                client.email?.toLowerCase().includes(search.toLowerCase())
            ),
        [clients, search]
    );

    const totalPages = Math.ceil(filteredClients.length / itensPerPage);
    const currentPageItens = filteredClients.slice((page - 1) * itensPerPage, page * itensPerPage);

    return (
        <ClientListContainer>
            <ClientListHeader>
                <ClientListHeaderLabel className="first-label">Nome</ClientListHeaderLabel>
                <ClientListHeaderLabel>Telefone</ClientListHeaderLabel>
                <ClientListHeaderLabel className="label-responsive">Cidade</ClientListHeaderLabel>
                <ClientListHeaderLabel>Opções</ClientListHeaderLabel>
            </ClientListHeader>
            {
                currentPageItens.map((cliente) => (
                    <SingleClient key={cliente.id} onClick={() => navigate(`/`)}>
                        <ClientValueContainer>
                            <ClientLabel><FaUser style={{ marginLeft: '5px' }} /></ClientLabel>
                            <ClientValue>{cliente.name}</ClientValue>
                        </ClientValueContainer>
                        <ClientValueContainer>
                            <ClientLabel><FaWhatsapp /></ClientLabel>
                            <ClientValue
                                href={cliente.phone ? `https://whatsa.me/55${cliente.phone}` : '#'}
                                target='_blank'
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >{cliente.phone}</ClientValue>
                        </ClientValueContainer>
                        <ClientValueContainer className="label-responsive">
                            <ClientLabel className="label-responsive"><FaMapPin /></ClientLabel>
                            <ClientValue className="label-responsive">{''}</ClientValue>
                        </ClientValueContainer>
                        <AdminContainer>
                            <EditIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedClient(cliente);
                                openEditModal();
                            }}>
                                <FaEdit />
                            </EditIconContainer>
                            <DeleteIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedClient(cliente);
                                openDeleteModal();
                            }}>
                                <FaTrashAlt />
                            </DeleteIconContainer>
                        </AdminContainer>
                    </SingleClient>
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
                        <ClientTitle><FaFileInvoice />Editar Cliente</ClientTitle>
                    </div>
                    <Formik
                        initialValues={{
                            id: selectedClient.id,
                            name: selectedClient.name,
                            email: selectedClient.email,
                            phone: selectedClient.phone,
                        }}
                        validationSchema={
                            Yup.object({
                                name: Yup.string().required('Nome é obrigatório'),
                                email: Yup.string().email('Digite um email válido'),
                                phone: Yup.string().matches(/^\d{11}$/, 'Telefone inválido'),
                            })
                        }
                        onSubmit={(values/*, { setSubmitting, setFieldError }*/) => {
                            console.log(values);
                        }}
                    >
                        {
                            ({ isSubmitting, values }) => (
                                <Form>
                                    <FormContent>
                                        <FormInputArea>
                                            <FormInputLabelRequired><MdDriveFileRenameOutline />Nome</FormInputLabelRequired>
                                            <FormInput
                                                type='text'
                                                name='name'
                                                placeholder='Nome do Cliente'
                                                autoComplete='name'
                                            />
                                        </FormInputArea>
                                        <FormInputArea>
                                            <FormInputLabel><MdAlternateEmail />Email</FormInputLabel>
                                            <FormInput
                                                type='text'
                                                name='email'
                                                placeholder='Email do Cliente'
                                                autoComplete='email'
                                            />
                                        </FormInputArea>
                                        <FormInputArea>
                                            <FormInputLabel><FaPhoneAlt /> Telefone</FormInputLabel>
                                            <MaskedInputComponent
                                                name='phone'
                                                type='text'
                                                mask={['(', /[0-9]/, /[0-9]/, ')', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                value={values.phone}
                                                placeholder='Telefone do Cliente'
                                                autoComplete='tel'
                                            />
                                        </FormInputArea>
                                        <ButtonGroup>
                                            <BackButton type="button" onClick={
                                                () => {
                                                    closeEditModal();
                                                }
                                            }>
                                                Cancelar</BackButton>
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
            <Modal
                isOpen={modalDeleteIsOpen}
                onRequestClose={closeDeleteModal}
                style={ModalStyles}
            >
                <DeleteContainer>
                    <IconWrapper>
                        <ImWarning />
                    </IconWrapper>
                    <DeleteTitle>Deseja excluir o Cliente {selectedClient.name}?</DeleteTitle>
                    <DeleteButtonContainer>
                        <BackButton onClick={() => {
                            closeDeleteModal();
                        }}>
                            Cancelar
                        </BackButton>
                        <SubmitButton onClick={() => {

                        }}>
                            Excluir
                        </SubmitButton>
                    </DeleteButtonContainer>
                </DeleteContainer>
            </Modal>
        </ClientListContainer>
    );
}

export default ClientList;