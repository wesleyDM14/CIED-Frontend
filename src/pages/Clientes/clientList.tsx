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
    Limitador,
    SingleClient,
    StyledFormArea,
    SubItensContainer,
    SubmitButton,
} from "./styles";
import Pagination from "../../components/Pagination";
import { FaCalendar, FaEdit, FaFileInvoice, FaHashtag, FaIdCard, FaMapMarkedAlt, FaMapPin, FaPhoneAlt, FaTrashAlt, FaUser, FaWhatsapp } from "react-icons/fa";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import Modal from 'react-modal';
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { MdAlternateEmail, MdDriveFileRenameOutline } from "react-icons/md";
import { ImWarning } from 'react-icons/im';
import { FormInput, MaskedInputComponent } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import { deleteClient, updateClient } from "../../services/clientService";

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

    const rootElement = document.getElementById('root');

    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

    const [modalEditIsOpen, setModalEditIsOpen] = useState<boolean>(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState<boolean>(false);

    const [deleting, setDeleting] = useState(false);

    const openEditModal = () => setModalEditIsOpen(true);

    const closeEditModal = () => {
        setModalEditIsOpen(false);
        setSelectedClient(null);
    };

    const openDeleteModal = () => setModalDeleteIsOpen(true);

    const closeDeleteModal = () => {
        setModalDeleteIsOpen(false);
        setSelectedClient(null);
    };

    const filteredClients = useMemo(
        () =>
            clients.filter((client) =>
                client.name?.toLowerCase().includes(search.toLowerCase()) ||
                client.phone?.toLowerCase().includes(search.toLowerCase()) ||
                client.email?.toLowerCase().includes(search.toLowerCase()) ||
                `${client.logradouro} ${client.bairro} ${client.cidade} ${client.uf}`.toLowerCase().includes(search.toLowerCase())
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
                            <ClientValue className="label-responsive"> {cliente.cidade}{cliente.uf ? ` - ${cliente.uf}` : ''}</ClientValue>
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
                            id: selectedClient?.id || '',
                            name: selectedClient?.name || '',
                            email: selectedClient?.email || '',
                            phone: selectedClient?.phone || '',
                            cpf: selectedClient?.cpf || '',
                            logradouro: selectedClient?.logradouro || '',
                            bairro: selectedClient?.bairro || '',
                            cidade: selectedClient?.cidade || '',
                            uf: selectedClient?.uf || '',
                            num: selectedClient?.num || null,
                        }}
                        validationSchema={
                            Yup.object({
                                name: Yup.string().required('Nome é obrigatório'),
                                cpf: Yup.string()
                                    .required('CPF é obrigatório'),
                                rg: Yup.string()
                                    .nullable(),
                                email: Yup.string().email('Digite um email válido'),
                                phone: Yup.string()
                                    .required('Telefone é obrigatório'),
                                dataNascimento: Yup.date()
                                    .max(new Date(), 'Data não pode ser futura')
                                    .nullable(),
                                num: Yup.number()
                                    .positive('Número inválido')
                                    .integer('Número inválido')
                                    .nullable(),
                            })
                        }
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            if (selectedClient) {
                                const updateData = {
                                    ...values,
                                    id: selectedClient.id,
                                    createdAt: selectedClient.createdAt,
                                    updatedAt: new Date()
                                };
                                updateClient(updateData, user, setLoading, setFieldError, setSubmitting, closeEditModal);
                            }
                        }}
                    >
                        {
                            ({ isSubmitting }) => (
                                <Form>
                                    <FormContent>
                                        <FormInputArea>
                                            <FormInputLabelRequired><MdDriveFileRenameOutline />Nome</FormInputLabelRequired>
                                            <FormInput
                                                type='text'
                                                name='name'
                                                placeholder='Nome completo'
                                            />
                                        </FormInputArea>
                                        <SubItensContainer>
                                            <Limitador>
                                                <FormInputArea>
                                                    <FormInputLabelRequired><FaIdCard />CPF</FormInputLabelRequired>
                                                    <MaskedInputComponent
                                                        name='cpf'
                                                        mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                        placeholder='000.000.000-00'
                                                    />
                                                </FormInputArea>
                                            </Limitador>
                                            <FormInputArea>
                                                <FormInputLabel><FaIdCard />RG</FormInputLabel>
                                                <MaskedInputComponent
                                                    name='rg'
                                                    mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/]}
                                                    placeholder='00.000.000-0'
                                                />
                                            </FormInputArea>
                                        </SubItensContainer>
                                        <SubItensContainer>
                                            <Limitador>
                                                <FormInputArea>
                                                    <FormInputLabel><FaCalendar />Nascimento</FormInputLabel>
                                                    <FormInput
                                                        type='date'
                                                        name='dataNascimento'
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                </FormInputArea>
                                            </Limitador>
                                            <FormInputArea>
                                                <FormInputLabelRequired><FaPhoneAlt />Telefone</FormInputLabelRequired>
                                                <MaskedInputComponent
                                                    name='phone'
                                                    mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                                    placeholder='(99) 99999-9999'
                                                />
                                            </FormInputArea>
                                        </SubItensContainer>
                                        <FormInputArea>
                                            <FormInputLabel><MdAlternateEmail />Email</FormInputLabel>
                                            <FormInput
                                                type='email'
                                                name='email'
                                                placeholder='exemplo@email.com'
                                            />
                                        </FormInputArea>
                                        <FormInputArea>
                                            <FormInputLabel><FaMapMarkedAlt />Logradouro</FormInputLabel>
                                            <FormInput
                                                type='text'
                                                name='logradouro'
                                                placeholder='Rua/Avenida'
                                            />
                                        </FormInputArea>
                                        <SubItensContainer>
                                            <Limitador>
                                                <FormInputArea>
                                                    <FormInputLabel><FaHashtag />Número</FormInputLabel>
                                                    <FormInput
                                                        type='number'
                                                        name='num'
                                                        placeholder='Nº'
                                                        min="0"
                                                    />
                                                </FormInputArea>
                                            </Limitador>
                                            <FormInputArea>
                                                <FormInputLabel><FaMapMarkedAlt />Bairro</FormInputLabel>
                                                <FormInput
                                                    type='text'
                                                    name='bairro'
                                                    placeholder='Bairro'
                                                />
                                            </FormInputArea>
                                        </SubItensContainer>
                                        <SubItensContainer>
                                            <Limitador>
                                                <FormInputArea>
                                                    <FormInputLabel><FaMapMarkedAlt />UF</FormInputLabel>
                                                    <FormInput
                                                        type='text'
                                                        name='uf'
                                                        placeholder='Estado'
                                                        maxLength={2}
                                                        style={{ textTransform: 'uppercase' }}
                                                    />
                                                </FormInputArea>
                                            </Limitador>
                                            <FormInputArea>
                                                <FormInputLabel><FaMapMarkedAlt />Cidade</FormInputLabel>
                                                <FormInput
                                                    type='text'
                                                    name='cidade'
                                                    placeholder='Cidade'
                                                />
                                            </FormInputArea>
                                        </SubItensContainer>
                                        <ButtonGroup>
                                            <BackButton type="button" onClick={closeEditModal}>
                                                Cancelar
                                            </BackButton>
                                            {
                                                !isSubmitting && (
                                                    <SubmitButton type="submit" className={isSubmitting ? "hidden" : ""}>Atualizar</SubmitButton>
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
                    <DeleteTitle>Deseja excluir o Cliente {selectedClient?.name}?</DeleteTitle>
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
                                    if (selectedClient?.id) {
                                        deleteClient(selectedClient.id, user, setDeleting, setLoading, closeDeleteModal);
                                    }
                                }}>
                                    Excluir
                                </SubmitButton>
                            )
                        }
                    </DeleteButtonContainer>
                </DeleteContainer>
            </Modal>
        </ClientListContainer>
    );
}

export default ClientList;