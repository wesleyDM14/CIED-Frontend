import { useEffect, useState } from "react";
import {
    AtendimentoContainer,
    AutoCallButton,
    Button,
    ButtonContainer,
    ButtonGroup,
    CallButton,
    CounterSelect,
    ErrorText,
    FormGroup,
    Header,
    ModalHeader,
    QueueContainer,
    QueueItem,
    QueueList,
    QueueSection,
    SectionTitle,
    Title,
} from "./styles";
import { colors, ModalStyles } from "../../utils/GlobalStyles";
import Modal from 'react-modal';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { PageProps, Ticket } from "../../contexts/interfaces";
import { callSpecificTicket, getTicketsQueue } from "../../services/atendimentoService";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectServiceCounter } from "../../selectors/selectUser";
import { setServiceCounter } from "../../reducers/sessionSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { FaEdit, FaMoneyBill, FaUser } from "react-icons/fa";

const socket = io(import.meta.env.VITE_BASE_URL);

const Atendimento: React.FC<PageProps> = ({ user }) => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const dispatch = useDispatch();

    const serviceCounter = useSelector(selectServiceCounter);

    const [normalQueue, setNormalQueue] = useState<Ticket[]>([]);

    const [preferentialQueue, setPreferentialQueue] = useState<Ticket[]>([]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSenha, setSelectedSenha] = useState<string>('');

    const [showCounterModal, setShowCounterModal] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState('');

    const openModal = (number: string) => {
        callSpecificTicket(user!, number, selectedCounter, setSelectedSenha, setModalOpen);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const iniciarAtendimento = () => {
        // Aqui você pode implementar a lógica para iniciar o atendimento:
        // ex.: cadastro do cliente, seleção do método de pagamento, procedimento, horário, etc.
        alert(`Atendimento iniciado para a senha ${selectedSenha}`);
        closeModal();
    };

    const handleSaveCounter = () => {
        if (selectedCounter) {
            dispatch(setServiceCounter(selectedCounter));
            setShowCounterModal(false);
        }
    };

    useEffect(() => {
        if (!serviceCounter) {
            setShowCounterModal(true);
        } else {
            setSelectedCounter(serviceCounter);
        }
    }, [serviceCounter]);

    useEffect(() => {
        const fetchData = () => {
            getTicketsQueue(user!, setNormalQueue, setPreferentialQueue)
                .catch((error) => console.error("Erro ao buscar filas:", error));
        };

        fetchData();

        socket.on("ticket:called", fetchData);
        socket.on("ticket:created", (ticket: Ticket) => {
            if (ticket.type === "NORMAL") {
                setNormalQueue((prevQueue) => [...prevQueue, ticket]);
            } else {
                setPreferentialQueue((prevQueue) => [...prevQueue, ticket]);
            }
        });

        return () => {
            socket.off("ticket:called");
            socket.off("ticket:created");
        };
    }, [user]);

    return (
        <AtendimentoContainer>
            <Header>
                <Title><HiOutlineQueueList />Painel de Senhas</Title>
                {serviceCounter && (
                    <div style={{
                        position: 'relative',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: colors.background,
                        color: 'black',
                        padding: '8px 16px',
                        borderRadius: '5px'
                    }}>
                        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Guichê: {serviceCounter}</span>
                        <button
                            onClick={() => setShowCounterModal(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'black',
                                cursor: 'pointer'
                            }}
                        >
                            ✏️
                        </button>
                    </div>
                )}
            </Header>
            <QueueContainer>
                <QueueSection>
                    <SectionTitle>Fila Normal</SectionTitle>
                    <QueueList>
                        {normalQueue.map((item) => (
                            <QueueItem key={item.id}>
                                <span>{item.code}</span>
                                <CallButton onClick={() => openModal(item.code!)}>Chamar</CallButton>
                            </QueueItem>
                        ))}
                    </QueueList>
                </QueueSection>
                <QueueSection>
                    <SectionTitle>Fila Preferencial</SectionTitle>
                    <QueueList>
                        {preferentialQueue.map((item) => (
                            <QueueItem key={item.id}>
                                <span>{item.code}</span>
                                <CallButton onClick={() => openModal(item.code!)}>Chamar</CallButton>
                            </QueueItem>
                        ))}
                    </QueueList>
                </QueueSection>
            </QueueContainer>
            <ButtonGroup>
                <AutoCallButton onClick={() => { }}>Chamar Próxima Senha</AutoCallButton>
            </ButtonGroup>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '500px',
                        width: '90%',
                        padding: '2rem'
                    }
                }}
                contentLabel="Iniciar Atendimento"
                ariaHideApp={false}
            >
                <Formik
                    initialValues={{
                        clientId: '',
                        code: '',
                        nome: '',
                        description: '',
                        preco: 0,
                        metodoPagamento: '',
                    }}
                    validationSchema={
                        Yup.object({
                            clientId: Yup.string().required('Obrigatório'),
                            nome: Yup.string().required('Obrigatório'),
                            description: Yup.string(),
                            preco: Yup.number().min(0),
                            metodoPagamento: Yup.string(),
                        })
                    }
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {
                        ({ isSubmitting }) => (
                            <Form>
                                <h2 style={{ marginBottom: '10px' }}>Senha: {selectedSenha}</h2>
                                <p style={{ marginBottom: '10px' }}>Preencha os dados do atendimento:</p>

                                <FormGroup>
                                    <label><FaUser style={{ marginRight: '5px' }} />Cliente:</label>
                                    <Field type='text' name='clientId' placeholder="Nome do cliente" />
                                    <ErrorMessage name="clientId" component={ErrorText} />
                                </FormGroup>
                                <FormGroup>
                                    <label><FaEdit style={{ marginRight: '5px' }} />Procedimento:</label>
                                    <Field type="text" name="nome" placeholder="Procedimento" />
                                    <ErrorMessage name="nome" component={ErrorText} />
                                </FormGroup>

                                <FormGroup>
                                    <label><FaEdit style={{ marginRight: '5px' }} />Descrição:</label>
                                    <Field type="text" name="description" placeholder="Descrição" />
                                    <ErrorMessage name="description" component={ErrorText} />
                                </FormGroup>

                                <FormGroup>
                                    <label><FaMoneyBill style={{ marginRight: '5px' }} />Método de Pagamento:</label>
                                    <Field as="select" name="metodoPagamento">
                                        <option value="">Selecione</option>
                                        <option value="DINHEIRO">Dinheiro</option>
                                        <option value="PIX">Pix</option>
                                        <option value="CARTAO">Cartão</option>
                                        <option value="CONVENIO">Convenio</option>
                                        <option value="SUS">SUS</option>
                                    </Field>
                                    <ErrorMessage name="metodoPagamento" component={ErrorText} />
                                </FormGroup>

                                <FormGroup>
                                    <label><FaMoneyBill style={{ marginRight: '5px' }} />Preço:</label>
                                    <Field type="number" name="preco" placeholder="Preço" step="0.01" min="0" />
                                    <ErrorMessage name="preco" component={ErrorText} />
                                </FormGroup>

                                <ButtonContainer>
                                    <Button type="submit" disabled={isSubmitting}>Marcar Atendimento</Button>
                                    <Button type="button" onClick={() => {/**/ }}>Chamar Novamente</Button>
                                    <Button type="button" $cancel onClick={closeModal}>Cancelar</Button>
                                </ButtonContainer>
                            </Form>
                        )
                    }
                </Formik>
            </Modal >

            <Modal
                isOpen={showCounterModal}
                onRequestClose={() => setShowCounterModal(false)}
                style={ModalStyles}
            >
                <div style={{ padding: '25px' }}>
                    <ModalHeader>Selecione seu guichê</ModalHeader>
                    <CounterSelect
                        value={selectedCounter}
                        onChange={(e) => setSelectedCounter(e.target.value)}
                    >
                        <option value="">Selecione um guichê...</option>
                        <option value="1">Guichê 1</option>
                        <option value="2">Guichê 2</option>
                        <option value="3">Guichê 3</option>
                    </CounterSelect>
                    <ButtonGroup>
                        <CallButton
                            onClick={handleSaveCounter}
                            disabled={!selectedCounter}
                            style={{ flex: 1 }}
                        >
                            Confirmar Guichê
                        </CallButton>
                    </ButtonGroup>
                </div>
            </Modal>
        </AtendimentoContainer >
    );
};

export default Atendimento;