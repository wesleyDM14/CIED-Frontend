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
import { FaCalendar, FaFileInvoice, FaHashtag, FaIdCard, FaMapMarkedAlt, FaPhoneAlt, FaPlus, FaPlusCircle, FaUsers } from "react-icons/fa";
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
                            cpf: '',
                            rg: '',
                            dataNascimento: undefined,
                            logradouro: '',
                            bairro: '',
                            cidade: '',
                            uf: '',
                            num: undefined,
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
                            createClient({
                                ...values,
                                dataNascimento: values.dataNascimento ? new Date(values.dataNascimento) : null,
                            }, user!, setLoading, setFieldError, setSubmitting, closeAddModal);
                        }}
                    >
                        {({ isSubmitting }) => (
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
                        )}
                    </Formik>
                </StyledFormArea>
            </Modal>
        </ClientsContainer>
    );
};

export default Clientes;