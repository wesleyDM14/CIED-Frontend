import { useEffect, useMemo, useState } from "react";
import { PageProps, Procedimento, Schedule } from "../../contexts/interfaces";
import { getAgendamentoDiario } from "../../services/agendaService";
import Modal from 'react-modal';
import Loading from "../../components/Loading";
import {
    ModalButton,
    ModalButtonContainer,
    ModalText,
    ModalTitle,
    NoProcedimentosFound,
    ProcedimentoCard,
    ProcedimentoCardContainer,
    ProcedimentoCardProfissional,
    ProcedimentoCardTitle,
    SenhaContainer,
    SenhaContent,
    SenhaContentSubtitle,
    SenhaHeader,
    SenhaTitle,
} from "./styles";
import { FaAccessibleIcon, FaTicketAlt, FaUser } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import { ModalStyles } from "../../utils/GlobalStyles";
import { ModalContent } from "../Agenda/styles";
import { createTicket, printTicket } from "../../services/ticketService";
import { ThreeDots } from "react-loader-spinner";

const Senha: React.FC<PageProps> = ({ user }) => {

    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');

    const [agendaDiaria, setAgendaDiaria] = useState<Schedule>();
    const [selectedProcedimento, setSelectedProcedimento] = useState<Procedimento | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmacaoModalIsOpen, setConfirmacaoModalIsOpen] = useState(false);
    const [tipoAtendimento, setTipoAtendimento] = useState<'NORMAL' | 'PREFERENCIAL' | null>(null);

    const [creatingTicket, setCreatingTicket] = useState<boolean>(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProcedimento(null);
    };

    const openConfirmacaoModal = (tipo: 'NORMAL' | 'PREFERENCIAL') => {
        setTipoAtendimento(tipo);
        setConfirmacaoModalIsOpen(true);
    };

    const closeConfirmacaoModal = () => {
        setConfirmacaoModalIsOpen(false);
        setTipoAtendimento(null);
    };

    const confirmarGeracaoSenha = async () => {
        if (selectedProcedimento && tipoAtendimento) {
            try {
                setCreatingTicket(true);
                const senhaGerada = await createTicket(user!, tipoAtendimento, selectedProcedimento.id!);

                if (senhaGerada) {
                    await printTicket(senhaGerada);
                }
            } catch (error) {
                console.log('Erro ao gerar a Senha:', error);
            } finally {
                closeConfirmacaoModal();
                setCreatingTicket(false);
                closeModal();
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (loading) {
                try {
                    await getAgendamentoDiario(user!, new Date(), setAgendaDiaria);
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchData();
    }, [loading, user]);

    const procedimentosDisponiveis = useMemo(() => {
        if (agendaDiaria && agendaDiaria.procedimentos) {
            return agendaDiaria.procedimentos.map((procedimento) => ({
                ...procedimento.procedimento,
                dailyScheduleId: agendaDiaria.id,
            }));
        }
        return [];
    }, [agendaDiaria]);

    const filteredProcedimentos = useMemo(() => {
        return procedimentosDisponiveis.filter((proc) =>
            proc.description?.toLowerCase().includes(search.toLowerCase()) ||
            proc.nomeProfissional?.toLowerCase().includes(search.toLowerCase())
        );
    }, [procedimentosDisponiveis, search]);

    return (
        <SenhaContainer>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <SenhaHeader>
                            <SenhaTitle><FaTicketAlt />Gerar Senha de Atendimento</SenhaTitle>
                        </SenhaHeader>
                        <SenhaContent>
                            <SenhaContentSubtitle>Qual Procedimento Deseja Realizar?</SenhaContentSubtitle>
                            <SearchBar search={search} setSearch={setSearch} />
                            <ProcedimentoCardContainer>
                                {
                                    filteredProcedimentos.map((procedimento) => (
                                        <ProcedimentoCard key={procedimento.id} onClick={() => {
                                            setSelectedProcedimento(procedimento);
                                            openModal();
                                        }}>
                                            <ProcedimentoCardTitle>{procedimento.description}</ProcedimentoCardTitle>
                                            <ProcedimentoCardProfissional>{procedimento.nomeProfissional}</ProcedimentoCardProfissional>
                                        </ProcedimentoCard>
                                    ))
                                }
                            </ProcedimentoCardContainer>
                            {
                                filteredProcedimentos.length === 0 && (
                                    <NoProcedimentosFound>Nenhum procedimento encontrado.</NoProcedimentosFound>
                                )
                            }
                        </SenhaContent>
                    </>
                )
            }
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={ModalStyles}
            >
                <ModalContent>
                    <ModalTitle>{selectedProcedimento?.description}</ModalTitle>
                    <ModalText>{selectedProcedimento?.nomeProfissional}</ModalText>
                    <ModalButtonContainer>
                        <ModalButton onClick={() => openConfirmacaoModal('NORMAL')}>
                            <FaUser /> Normal
                        </ModalButton>
                        <ModalButton onClick={() => openConfirmacaoModal('PREFERENCIAL')}>
                            <FaAccessibleIcon /> Preferencial
                        </ModalButton>
                    </ModalButtonContainer>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={confirmacaoModalIsOpen}
                onRequestClose={closeConfirmacaoModal}
                style={ModalStyles}
            >
                <>
                    {
                        creatingTicket ? (
                            <ModalContent>
                                <ThreeDots />
                            </ModalContent>
                        ) : (
                            <ModalContent>
                                <ModalTitle>Confirmar Geração de Senha</ModalTitle>
                                <ModalText>Você deseja gerar uma senha {tipoAtendimento === 'NORMAL' ? 'Normal' : 'Preferencial'}?</ModalText>
                                <ModalButtonContainer>
                                    <ModalButton onClick={confirmarGeracaoSenha}>Confirmar</ModalButton>
                                    <ModalButton onClick={closeConfirmacaoModal}>Cancelar</ModalButton>
                                </ModalButtonContainer>
                            </ModalContent>
                        )
                    }
                </>
            </Modal>
        </SenhaContainer>
    );
}
export default Senha;