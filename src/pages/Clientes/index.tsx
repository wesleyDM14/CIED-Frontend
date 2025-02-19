import { useEffect, useState } from "react";
import {
    AddClientButton,
    AddClientContainer,
    AddIcon,
    AddText,
    BackButton,
    ButtonGroup,
    ClientContent,
    ClientHeader,
    ClientsContainer,
    ClientTitle,
    FormContent,
    FormInputArea,
    FormInputLabel,
    FormInputLabelRequired,
    IconWrapper,
    Limitador,
    NoContentActionContainer,
    NoContentContainer,
    StyledFormArea,
    SubItensContainer,
    SubmitButton,
    TextContent,
} from "./styles";
import Loading from "../../components/Loading";
import { FaFileInvoice, FaMapMarkedAlt, FaPhoneAlt, FaPlus, FaPlusCircle, FaUsers } from "react-icons/fa";
import { MdAlternateEmail, MdDriveFileRenameOutline } from "react-icons/md";
import { Cliente, PageProps } from "../../contexts/interfaces";
import SearchBar from "../../components/SearchBar";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import { createClient, getClients } from "../../services/clientService";
import Modal from 'react-modal';
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { FormInput, MaskedInputComponent } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import ClientList from "./clientList";

const Clientes: React.FC<PageProps> = ({ navigate, user }) => {

    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [clients, setClients] = useState<Cliente[]>([]);

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
            getClients(user!, setClients, setLoading);
        }
    }, [user, loading]);

    return (
        <ClientsContainer>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <ClientHeader>
                            <ClientTitle><FaUsers />Clientes</ClientTitle>
                            <AddClientContainer onClick={openAddModal}>
                                <AddIcon>
                                    <FaPlusCircle />
                                </AddIcon>
                                <AddText>Adicionar Novo</AddText>
                            </AddClientContainer>
                        </ClientHeader>
                        <ClientContent>
                            <SearchBar search={search} setSearch={setSearch} />
                            {
                                clients.length === 0 ? (
                                    <NoContentContainer>
                                        <IconWrapper>
                                            <FaUsers />
                                        </IconWrapper>
                                        <NoContentActionContainer>
                                            <TextContent>Nenhum Cliente encontrado.</TextContent>
                                            <AddClientButton onClick={openAddModal}>
                                                <FaPlus color={colors.icon} fontSize={15} className="icon-add-button" /> Novo Cliente
                                            </AddClientButton>
                                        </NoContentActionContainer>
                                    </NoContentContainer>
                                ) : (
                                    <ClientList
                                        clients={clients}
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
                        </ClientContent>
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
                        <ClientTitle><FaFileInvoice />Cadastrar Cliente</ClientTitle>
                    </div>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            phone: '',
                            address: '',
                        }}
                        validationSchema={
                            Yup.object({
                                name: Yup.string().required('Nome é obrigatório'),
                                email: Yup.string().email('Digite um email válido'),
                                phone: Yup.string().matches(/^\d{11}$/, 'Telefone inválido'),
                                address: Yup.string(),
                            })
                        }
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            createClient(values, user!, setLoading, setFieldError, setSubmitting, closeAddModal);
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
                                        <SubItensContainer>
                                            <Limitador>
                                                <FormInputArea>
                                                    <FormInputLabel><FaMapMarkedAlt />Cidade</FormInputLabel>
                                                    <FormInput
                                                        type='text'
                                                        name='address'
                                                        placeholder='Cidade do Cliente'
                                                        autoComplete='address'
                                                    />
                                                </FormInputArea>
                                            </Limitador>
                                            <FormInputArea>
                                                <FormInputLabel><FaPhoneAlt />Telefone</FormInputLabel>
                                                <MaskedInputComponent
                                                    name='phone'
                                                    type='text'
                                                    mask={['(', /[0-9]/, /[0-9]/, ')', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                                    value={values.phone}
                                                    placeholder='Telefone do Cliente'
                                                    autoComplete='tel'
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
        </ClientsContainer>
    );
};

export default Clientes;