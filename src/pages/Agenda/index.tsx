import { useEffect, useState } from "react";
import { PageProps, Procedimento, Schedule } from "../../contexts/interfaces";
import {
    AddButton,
    CalendarContainer,
    CalendarDay,
    CalendarGrid,
    CalendarHeader,
    DayNumber,
    GradientBackground,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    NavigationButton,
    ProcedureCard,
    ScheduleBadge,
    ScheduleList,
    TodayButton,
    WeekDay,
    WeekDaysHeader,
    SelectedProcedure,
    SaveButton,
} from "./styles";
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaPlus, FaStethoscope } from "react-icons/fa";
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { getProcedimentos } from "../../services/procedimentoService";
import { getAgendamentoMensal, registraAgendaDiaria, removerProcedimentoAgenda } from "../../services/agendaService";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { ThreeDots } from "react-loader-spinner";

const Agenda: React.FC<PageProps> = ({ user }) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [showAddProcedures, setShowAddProcedures] = useState(false);

    const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
    const [agendamentoMensal, setAgendamentoMensal] = useState<Schedule[]>([]);
    const [selectedProcedures, setSelectedProcedures] = useState<Procedimento[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const proceduresPerPage = 5;

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const firstDayOfGrid = startOfWeek(monthStart, { weekStartsOn: 0 });
    const lastDayOfGrid = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const daysInGrid = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });

    const [salving, setSalving] = useState<boolean>(false);

    const weekDays = eachDayOfInterval({
        start: startOfWeek(currentDate, { locale: ptBR }),
        end: endOfWeek(currentDate, { locale: ptBR })
    });

    const openModal = (mode: 'add' | 'edit') => {
        setModalMode(mode);
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProcedures([]);
        setSelectedScheduleId(null);
        setShowAddProcedures(false);
    };

    const handleEditDate = (date: Date) => {
        const schedule = agendamentoMensal.find(a =>
            format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        setSelectedDate(date);
        setSelectedScheduleId(schedule?.id || null);
        setSelectedProcedures(schedule?.procedimentos.map(sp => sp.procedimento) || []);
        openModal('edit');
    };

    const handleAddDate = (date: Date, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedDate(date);
        setSelectedProcedures([]);
        openModal('add');
    };

    const handleAddProcedure = (procedimento: Procedimento) => {
        setSelectedProcedures(prevState =>
            prevState.some(p => p.id === procedimento.id)
                ? prevState.filter(p => p.id !== procedimento.id)
                : [...prevState, procedimento]
        );
    };

    const handleRemoveProcedure = async (procedimento: Procedimento) => {
        if (!selectedScheduleId || !procedimento.id) {
            alert('Erro ao identificar o agendamento');
            return;
        }

        if (window.confirm('Tem certeza que deseja remover este procedimento da agenda?')) {
            try {
                await removerProcedimentoAgenda(user!, selectedScheduleId, procedimento.id, setLoading);
                setSelectedProcedures(prev => prev.filter(p => p.id !== procedimento.id));
            } catch (error) {
                console.error(error);
                alert('Erro ao remover procedimento');
            }
        }
    };

    const filteredProcedures = procedimentos.filter(proc =>
        proc.nomeProfissional?.toLowerCase().includes(search.toLowerCase()) ||
        proc.description?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProcedures.length / proceduresPerPage);
    const paginatedProcedures = filteredProcedures.slice(
        (currentPage - 1) * proceduresPerPage,
        currentPage * proceduresPerPage
    );

    const handleSaveAgenda = async () => {
        if (!selectedDate) {
            alert("Selecione uma data.");
            return;
        }

        try {
            setSalving(true);

            const procedimentosToSave = selectedProcedures.map((proc) => ({
                procedimentoId: proc.id!,
            }));

            await registraAgendaDiaria(user!, selectedDate, procedimentosToSave, closeModal, setLoading);
        } catch (error) {
            console.error(error);
            alert("Erro ao registrar a agenda.");
        } finally {
            setSalving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (loading) {
                try {
                    const ano = currentDate.getFullYear();
                    const mes = currentDate.getMonth() + 1;

                    await Promise.all([
                        getProcedimentos(user!, setProcedimentos),
                        getAgendamentoMensal(user!, mes, ano, setAgendamentoMensal)
                    ]);

                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (user) {
            fetchData();
        }

    }, [loading, user, currentDate]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <GradientBackground>
                    <CalendarContainer>
                        <CalendarHeader>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <h1>
                                    <FaCalendarAlt className="header-icon" />
                                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                                </h1>
                            </motion.div>

                            <div className="navigation">
                                <NavigationButton onClick={() => setCurrentDate(addDays(currentDate, -30))}>
                                    <FaChevronLeft />
                                </NavigationButton>

                                <TodayButton onClick={() => setCurrentDate(new Date())}>
                                    Hoje
                                </TodayButton>

                                <NavigationButton onClick={() => setCurrentDate(addDays(currentDate, 30))}>
                                    <FaChevronRight />
                                </NavigationButton>
                            </div>
                        </CalendarHeader>

                        <WeekDaysHeader>
                            {weekDays.map((day, index) => (
                                <WeekDay key={index}>
                                    {format(day, 'EEE', { locale: ptBR }).replace('.', '')}
                                </WeekDay>
                            ))}
                        </WeekDaysHeader>

                        <CalendarGrid>
                            {daysInGrid.map(day => {
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const schedule = agendamentoMensal.find(a =>
                                    format(a.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                                );

                                return (
                                    <CalendarDay
                                        key={day.toString()}
                                        onClick={() => isCurrentMonth && handleEditDate(day)}
                                        $hasSchedule={!!schedule}
                                        className={`${isCurrentMonth ? '' : 'other-month'} ${!isCurrentMonth ? 'non-clickable' : ''}`}
                                    >
                                        <DayNumber $currentMonth={isCurrentMonth}>
                                            {format(day, 'd')}
                                        </DayNumber>

                                        {isCurrentMonth && schedule && (
                                            <ScheduleList>
                                                {schedule.procedimentos.map((sp, index) => (
                                                    <ScheduleBadge key={sp.id} $index={index}>
                                                        <FaStethoscope />
                                                        <span>{sp.procedimento.description}</span>
                                                    </ScheduleBadge>
                                                ))}
                                            </ScheduleList>
                                        )}

                                        {isCurrentMonth && !schedule && (
                                            <AddButton onClick={(e) => handleAddDate(day, e)}>
                                                <FaPlus />
                                            </AddButton>
                                        )}
                                    </CalendarDay>
                                );
                            })}
                        </CalendarGrid>

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            className="modal"
                            overlayClassName="overlay"
                            shouldCloseOnOverlayClick={true}
                        >
                            <ModalOverlay onClick={closeModal}>
                                <ModalContent onClick={(e) => e.stopPropagation()}>
                                    <ModalHeader>
                                        <h2>
                                            {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                                        </h2>
                                        <button onClick={closeModal}>×</button>
                                    </ModalHeader>

                                    {modalMode === 'add' ? (
                                        <>
                                            <SearchBar search={search} setSearch={setSearch} />
                                            <div className="procedures-list">
                                                <h3>Procedimentos Disponíveis</h3>
                                                {paginatedProcedures.map(proc => (
                                                    <ProcedureCard key={proc.id}>
                                                        <div className="procedure-info">
                                                            <h4>{proc.nomeProfissional}</h4>
                                                            <p>{proc.description}</p>
                                                        </div>
                                                        <button onClick={() => handleAddProcedure(proc)}>
                                                            {selectedProcedures.some(p => p.id === proc.id)
                                                                ? 'Remover'
                                                                : 'Adicionar'}
                                                        </button>
                                                    </ProcedureCard>
                                                ))}
                                                {totalPages > 1 && (
                                                    <Pagination
                                                        totalPages={totalPages}
                                                        currentPage={currentPage}
                                                        setPage={setCurrentPage}
                                                    />
                                                )}
                                            </div>
                                            {selectedProcedures.length > 0 && (
                                                <div>
                                                    <h4>Procedimentos Selecionados:</h4>
                                                    {selectedProcedures.map(proc => (
                                                        <SelectedProcedure key={proc.id}>
                                                            <span>{proc.description}</span>
                                                            <button onClick={() => handleAddProcedure(proc)}>
                                                                Remover
                                                            </button>
                                                        </SelectedProcedure>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="edit-mode-controls">
                                                <button
                                                    onClick={() => setShowAddProcedures(!showAddProcedures)}
                                                    className="toggle-button"
                                                >
                                                    {showAddProcedures
                                                        ? `Ver Agendados (${selectedProcedures.length})`
                                                        : `Adicionar Procedimentos (${procedimentos.length})`}
                                                </button>
                                            </div>

                                            {showAddProcedures ? (
                                                <>
                                                    <SearchBar search={search} setSearch={setSearch} />
                                                    <div className="procedures-list">
                                                        <h3>Procedimentos Disponíveis</h3>
                                                        {paginatedProcedures.map(proc => (
                                                            <ProcedureCard key={proc.id}>
                                                                <div className="procedure-info">
                                                                    <h4>{proc.nomeProfissional}</h4>
                                                                    <p>{proc.description}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleAddProcedure(proc)}
                                                                    disabled={selectedProcedures.some(p => p.id === proc.id)}
                                                                >
                                                                    {selectedProcedures.some(p => p.id === proc.id)
                                                                        ? 'Já Adicionado'
                                                                        : 'Adicionar'}
                                                                </button>
                                                            </ProcedureCard>
                                                        ))}
                                                        {totalPages > 1 && (
                                                            <Pagination
                                                                totalPages={totalPages}
                                                                currentPage={currentPage}
                                                                setPage={setCurrentPage}
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="existing-procedures">
                                                    <h3>Procedimentos Agendados</h3>
                                                    {selectedProcedures.length === 0 ? (
                                                        <p className="empty-message">Nenhum procedimento agendado</p>
                                                    ) : (
                                                        selectedProcedures.map(proc => (
                                                            <SelectedProcedure key={proc.id}>
                                                                <span>{proc.description}</span>
                                                                <button
                                                                    onClick={() => handleRemoveProcedure(proc)}
                                                                    className="remove-btn"
                                                                >
                                                                    Remover
                                                                </button>
                                                            </SelectedProcedure>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <SaveButton
                                        onClick={handleSaveAgenda}
                                        disabled={modalMode === 'add' && selectedProcedures.length === 0 || loading}
                                    >
                                        {salving ? (
                                            <ThreeDots
                                                height="18"
                                                width="40"
                                                color="#ffffff"
                                                wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                            />
                                        ) : (
                                            modalMode === 'add' ? 'Salvar Agenda' : 'Atualizar Agenda'
                                        )}
                                    </SaveButton>
                                </ModalContent>
                            </ModalOverlay>
                        </Modal>
                    </CalendarContainer>
                </GradientBackground>
            )}
        </>
    );
};

export default Agenda;