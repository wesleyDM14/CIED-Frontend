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
import { getAgendamentoMensal, /*registrarAgendaDiaria*/ } from "../../services/agendaService";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";

const Agenda: React.FC<PageProps> = ({ user }) => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    const weekDays = eachDayOfInterval({
        start: startOfWeek(currentDate, { locale: ptBR }),
        end: endOfWeek(currentDate, { locale: ptBR })
    });

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProcedures([]);
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        openModal();
    };

    const handleAddProcedure = (procedimento: Procedimento) => {
        setSelectedProcedures(prevState => {
            if (prevState.some(p => p.id === procedimento.id)) {
                return prevState.filter(p => p.id !== procedimento.id); // Remove if already selected
            }
            return [...prevState, procedimento]; // Add if not selected
        });
    };

    const filteredProcedures = procedimentos.filter(proc =>
        proc.nomeProfissional?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProcedures.length / proceduresPerPage);
    const paginatedProcedures = filteredProcedures.slice(
        (currentPage - 1) * proceduresPerPage,
        currentPage * proceduresPerPage
    );

    const handleSaveAgenda = async () => {
        if (selectedDate && selectedProcedures.length > 0) {
            try {
                const procedimentosToSave = selectedProcedures.map((proc) => ({
                    procedimentoId: proc.id,
                }));

                console.log(procedimentosToSave);
                /*await registrarAgendaDiaria(selectedDate, procedimentos);*/ // Chama a função para registrar
                alert("Agenda registrada com sucesso!");
                closeModal(); // Fechar o modal após salvar
                setSelectedProcedures([]); // Resetar os procedimentos selecionados
            } catch (error) {
                console.error(error);
                alert("Erro ao registrar a agenda.");
            }
        } else {
            alert("Selecione uma data e ao menos um procedimento.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (loading) {
                try {
                    const ano = selectedDate ? selectedDate.getFullYear() : currentDate.getFullYear();
                    const mes = selectedDate ? selectedDate.getMonth() + 1 : currentDate.getMonth() + 1;

                    await Promise.all([
                        getProcedimentos(user!, setProcedimentos),
                        getAgendamentoMensal(user!, ano, mes, setAgendamentoMensal)
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

    }, [loading, user, currentDate, selectedDate]);

    return (
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
                                onClick={() => isCurrentMonth && handleDateSelect(day)}
                                $hasSchedule={!!schedule}
                                className={`${isCurrentMonth ? '' : 'other-month'} ${!isCurrentMonth ? 'non-clickable' : ''}`}
                            >
                                <DayNumber $currentMonth={isCurrentMonth}>
                                    {format(day, 'd')}
                                </DayNumber>

                                {isCurrentMonth && schedule && (
                                    <ScheduleList>
                                        {schedule.procedimentos.map((sp, index) => (
                                            <ScheduleBadge key={sp.id} index={index}>
                                                <FaStethoscope />
                                                <span>{sp.procedimento.nomeProfissional}</span>
                                            </ScheduleBadge>
                                        ))}
                                    </ScheduleList>
                                )}

                                {isCurrentMonth && <AddButton><FaPlus /></AddButton>}
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

                            <SearchBar search={search} setSearch={setSearch} />

                            <div className="procedures-list">
                                <h3>Procedimentos Disponíveis</h3>
                                {paginatedProcedures.map(proc => (
                                    <ProcedureCard key={proc.id}>
                                        <div className="procedure-info">
                                            <h4>{proc.nomeProfissional}</h4>
                                            <p>{proc.description}</p>
                                        </div>
                                        <button onClick={() => handleAddProcedure(proc)}>Adicionar</button>
                                    </ProcedureCard>
                                ))}
                                {totalPages > 1 && (
                                    <Pagination totalPages={totalPages} currentPage={currentPage} setPage={setCurrentPage} />
                                )}
                            </div>

                            <div>
                                {selectedProcedures.length > 0 && (
                                    <div>
                                        <h4>Procedimentos Selecionados:</h4>
                                        {selectedProcedures.map((proc) => (
                                            <SelectedProcedure key={proc.id}>
                                                <span>{proc.nomeProfissional}</span>
                                                <button onClick={() => handleAddProcedure(proc)}>Remover</button>
                                            </SelectedProcedure>
                                        ))}
                                    </div>
                                )}

                                <SaveButton onClick={handleSaveAgenda} disabled={selectedProcedures.length === 0}>
                                    Salvar Agenda
                                </SaveButton>
                            </div>
                        </ModalContent>
                    </ModalOverlay>
                </Modal>
            </CalendarContainer>
        </GradientBackground>
    );
};

export default Agenda;
