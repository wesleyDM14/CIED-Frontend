import { useMemo, useState } from "react";
import { Procedimento, User } from "../../contexts/interfaces";
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
    ProcedimentoLabel,
    ProcedimentoListContainer,
    ProcedimentoListHeader,
    ProcedimentoListHeaderLabel,
    ProcedimentoTitle,
    ProcedimentoValue,
    ProcedimentoValueContainer,
    SingleProcedimento,
    StyledFormArea,
    SubmitButton,
} from "./styles";
import { FaClipboardList, FaEdit, FaFileInvoice, FaTrashAlt, FaUser } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { deleteProcedimento, updateProcedimento } from "../../services/procedimentoService";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FormInput } from "../../components/FormLib";
import { ThreeDots } from "react-loader-spinner";
import { ImWarning } from "react-icons/im";

interface ProcedimentoListProps {
    procedimentos: Procedimento[];
    navigate: (path: string) => void;
    search: string;
    page: number;
    setPage: (page: number) => void;
    itensPerPage: number;
    setLoading: (loading: boolean) => void;
    user: User;
}

const ProcedimentoList: React.FC<ProcedimentoListProps> = ({ procedimentos, navigate, search, page, setPage, itensPerPage, setLoading, user }) => {
    const rootElement = document.getElementById('root');

    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [selectedProcedimento, setSelectedProcedimento] = useState<Procedimento | null>(null);

    const [modalEditIsOpen, setModalEditIsOpen] = useState<boolean>(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState<boolean>(false);

    const [deleting, setDeleting] = useState(false);

    const openEditModal = () => setModalEditIsOpen(true);

    const closeEditModal = () => {
        setModalEditIsOpen(false);
        setSelectedProcedimento(null);
    };

    const openDeleteModal = () => setModalDeleteIsOpen(true);

    const closeDeleteModal = () => {
        setModalDeleteIsOpen(false);
        setSelectedProcedimento(null);
    };

    const filteredProcedimentos = useMemo(
        () =>
            procedimentos.filter((procedimento) =>
                procedimento.description?.toLowerCase().includes(search.toLowerCase()) ||
                procedimento.nomeProfissional?.toLowerCase().includes(search.toLowerCase())
            ),
        [procedimentos, search]
    );

    const totalPages = Math.ceil(filteredProcedimentos.length / itensPerPage);
    const currentPageItens = filteredProcedimentos.slice((page - 1) * itensPerPage, page * itensPerPage);


    return (
        <ProcedimentoListContainer>
            <ProcedimentoListHeader>
                <ProcedimentoListHeaderLabel className="first-label">Nome</ProcedimentoListHeaderLabel>
                <ProcedimentoListHeaderLabel>Profissional</ProcedimentoListHeaderLabel>
                <ProcedimentoListHeaderLabel>Opções</ProcedimentoListHeaderLabel>
            </ProcedimentoListHeader>
            {
                currentPageItens.map((procedimento) => (
                    <SingleProcedimento key={procedimento.id} onClick={() => navigate('/')}>
                        <ProcedimentoValueContainer>
                            <ProcedimentoLabel className="label-responsive"><FaClipboardList />Procedimento:</ProcedimentoLabel>
                            <ProcedimentoValue>{procedimento.description}</ProcedimentoValue>
                        </ProcedimentoValueContainer>
                        <ProcedimentoValueContainer>
                            <ProcedimentoLabel className="label-responsive"><FaUser />Profissional:</ProcedimentoLabel>
                            <ProcedimentoValue>{procedimento.nomeProfissional}</ProcedimentoValue>
                        </ProcedimentoValueContainer>
                        <AdminContainer>
                            <EditIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedProcedimento(procedimento);
                                openEditModal();
                            }}>
                                <FaEdit />
                            </EditIconContainer>
                            <DeleteIconContainer onClick={(event) => {
                                event.stopPropagation();
                                setSelectedProcedimento(procedimento);
                                openDeleteModal();
                            }}>
                                <FaTrashAlt />
                            </DeleteIconContainer>
                        </AdminContainer>
                    </SingleProcedimento>
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
                        <ProcedimentoTitle><FaFileInvoice />Editar Procedimento</ProcedimentoTitle>
                    </div>
                    <Formik
                        initialValues={{
                            id: selectedProcedimento?.id || '',
                            nomeProfissional: selectedProcedimento?.nomeProfissional || '',
                            description: selectedProcedimento?.description || '',
                        }}
                        validationSchema={
                            Yup.object({
                                nomeProfissional: Yup.string().required('Obrigatório'),
                                description: Yup.string().required('Obrigatório')
                            })
                        }
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            updateProcedimento(values, user!, setFieldError, setSubmitting, closeEditModal, setLoading);
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
                        )}
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
                    <DeleteTitle>Deseja excluir o Procedimento {selectedProcedimento?.description}?</DeleteTitle>
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
                                    if (selectedProcedimento?.id) {
                                        deleteProcedimento(selectedProcedimento.id, user, setDeleting, setLoading, closeDeleteModal);
                                    }
                                }}>
                                    Excluir
                                </SubmitButton>
                            )
                        }
                    </DeleteButtonContainer>
                </DeleteContainer>
            </Modal>
        </ProcedimentoListContainer>
    );
}

export default ProcedimentoList;