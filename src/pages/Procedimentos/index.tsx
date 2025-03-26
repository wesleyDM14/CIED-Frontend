import { useEffect, useState } from "react";
import { PageProps, Procedimento } from "../../contexts/interfaces";
import Modal from 'react-modal';
import {
    AddIcon,
    AddProcedimentoButton,
    AddProcedimentoContainer,
    AddText,
    BackButton,
    ButtonGroup,
    FormContent,
    FormInputArea,
    FormInputLabelRequired,
    IconWrapper,
    NoContentActionContainer,
    NoContentContainer,
    ProcedimentoContainer,
    ProcedimentoContent,
    ProcedimentoHeader,
    ProcedimentoTitle,
    StyledFormArea,
    SubmitButton,
    TextContent,
} from "./styles";
import Loading from "../../components/Loading";
import { FaClipboardList, FaFileInvoice, FaPlus, FaPlusCircle } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FormInput } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import { createProcedimento, getProcedimentos } from "../../services/procedimentoService";
import ProcedimentoList from "./procedimentoList";

const Procedimentos: React.FC<PageProps> = ({ navigate, user }) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);

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
            getProcedimentos(user!, setProcedimentos, setLoading);
        }
    }, [user, loading]);

    return (
        <ProcedimentoContainer>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <ProcedimentoHeader>
                            <ProcedimentoTitle><FaClipboardList />Procedimentos</ProcedimentoTitle>
                            <AddProcedimentoContainer onClick={openAddModal}>
                                <AddIcon>
                                    <FaPlusCircle />
                                </AddIcon>
                                <AddText>Adicionar Novo</AddText>
                            </AddProcedimentoContainer>
                        </ProcedimentoHeader>
                        <ProcedimentoContent>
                            <SearchBar search={search} setSearch={setSearch} />
                            {
                                procedimentos.length === 0 ? (
                                    <NoContentContainer>
                                        <IconWrapper>
                                            <FaClipboardList />
                                        </IconWrapper>
                                        <NoContentActionContainer>
                                            <TextContent>Nenhum Cliente encontrado.</TextContent>
                                            <AddProcedimentoButton onClick={openAddModal}>
                                                <FaPlus color={colors.icon} fontSize={15} className="icon-add-button" /> Novo Procedimento
                                            </AddProcedimentoButton>
                                        </NoContentActionContainer>
                                    </NoContentContainer>
                                ) : (
                                    <ProcedimentoList
                                        procedimentos={procedimentos}
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
                            <Modal
                                isOpen={modalAddIsOpen}
                                onRequestClose={closeAddModal}
                                style={ModalStyles}
                            >
                                <StyledFormArea>
                                    <div style={{ display: 'flex', marginBottom: '30px', alignItems: 'center', justifyContent: 'center' }}>
                                        <ProcedimentoTitle><FaFileInvoice />Cadastrar Procedimento</ProcedimentoTitle>
                                    </div>
                                    <Formik
                                        initialValues={{
                                            nomeProfissional: '',
                                            description: '',
                                        }}
                                        validationSchema={
                                            Yup.object({
                                                nomeProfissional: Yup.string().required('Obrigatório'),
                                                description: Yup.string().required('Obrigatório')
                                            })
                                        }
                                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                                            createProcedimento(values, user!, setFieldError, setSubmitting, closeAddModal, setLoading);
                                        }}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <FormContent>
                                                    <FormInputArea>
                                                        <FormInputLabelRequired><MdDriveFileRenameOutline />Nome</FormInputLabelRequired>
                                                        <FormInput
                                                            type='text'
                                                            name='description'
                                                            placeholder='Procedimento'
                                                        />
                                                    </FormInputArea>
                                                    <FormInputArea>
                                                        <FormInputLabelRequired><MdDriveFileRenameOutline />Profissional</FormInputLabelRequired>
                                                        <FormInput
                                                            type='text'
                                                            name='nomeProfissional'
                                                            placeholder='Nome'
                                                        />
                                                    </FormInputArea>
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
                        </ProcedimentoContent>
                    </>
                )
            }
        </ProcedimentoContainer>
    );
}

export default Procedimentos;