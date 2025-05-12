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
    QueueCard,
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
import { Cliente, PageProps, QueueItemInterface, Ticket } from "../../contexts/interfaces";
import { callSpecificTicket, finalizeTicket, gerarFichaAtendimento, getTicketsQueue, recalLastTicket } from "../../services/atendimentoService";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectServiceCounter } from "../../selectors/selectUser";
import { setServiceCounter } from "../../reducers/sessionSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { FaCalendar, FaHashtag, FaIdCard, FaMapMarkedAlt, FaMoneyBill, FaPhoneAlt, FaUser } from "react-icons/fa";
import { getClients } from "../../services/clientService";
import Loading from "../../components/Loading";
import { FormInputLabel, FormInputLabelRequired, Limitador, SubItensContainer } from "../Clientes/styles";
import { MdAlternateEmail } from "react-icons/md";
import axios from "axios";

const socket = io(import.meta.env.VITE_BASE_URL);

const Atendimento: React.FC<PageProps> = ({ user }) => {

    const rootElement = document.getElementById('root');

    if (rootElement) {
        Modal.setAppElement(rootElement);
    }

    const dispatch = useDispatch();

    const serviceCounter = useSelector(selectServiceCounter);

    const [queues, setQueues] = useState<QueueItemInterface[]>([]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSenha, setSelectedSenha] = useState<string>('');

    const [showCounterModal, setShowCounterModal] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState('');
    const [selectedProcedimento, setSelectedProcedimento] = useState('');
    const [profissional, setSelectedProfissional] = useState('');
    const [ticketId, setTicketId] = useState('');

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const openModal = (number: string, procedimento: string, profissional: string, ticketId: string) => {
        setSelectedProcedimento(procedimento);
        setSelectedProfissional(profissional);
        setTicketId(ticketId);
        callSpecificTicket(user!, number, selectedCounter, setSelectedSenha, setModalOpen);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedClient(null);
        setSelectedProcedimento('');
        setSelectedProfissional('');
        setTicketId('');
    };

    const calcularIdade = (dataNasc: Date) => {
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNasc.getFullYear();
        const mes = hoje.getMonth() - dataNasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
            idade--;
        }
        return idade;
    };

    const handleSaveCounter = () => {
        if (selectedCounter) {
            dispatch(setServiceCounter(selectedCounter));
            setShowCounterModal(false);
        }
    };

    const handleSelectClient = (value: string, setFieldValue: any) => {
        const clienteSelecionado = clientes.find(c => c.name === value);

        if (clienteSelecionado) {
            setFieldValue('clientId', clienteSelecionado.id);
            setFieldValue('cpf', clienteSelecionado.cpf || '');
            setFieldValue('email', clienteSelecionado.email || '');
            setFieldValue('phone', clienteSelecionado.phone || '');
            setFieldValue('rg', clienteSelecionado.rg || '');
            setFieldValue('dataNascimento', clienteSelecionado.dataNascimento?.toDateString().split('T')[0] || '');
            setFieldValue('logradouro', clienteSelecionado.logradouro || '');
            setFieldValue('bairro', clienteSelecionado.bairro || '');
            setFieldValue('cidade', clienteSelecionado.cidade || '');
            setFieldValue('uf', clienteSelecionado.uf || '');
            setFieldValue('num', clienteSelecionado.num || '');
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            if (loading) {
                await getClients(user!, setClientes, setLoading);
            }
        }

        fetchClients();
    }, [user, loading]);

    useEffect(() => {
        if (!serviceCounter) {
            setShowCounterModal(true);
        } else {
            setSelectedCounter(serviceCounter);
        }
    }, [serviceCounter]);

    useEffect(() => {
        const fetchData = () => {
            getTicketsQueue(user!, setQueues)
                .catch((error) => console.error("Erro ao buscar filas:", error));
        };

        fetchData();

        const createdHandler = (ticket: Ticket) => {
            setQueues((prevQueues) => {
                const updatedQueues = [...prevQueues];
                const procedureName = ticket.procedimento?.description || '';
                const profissionalName = ticket.procedimento?.nomeProfissional || '';

                let queue = updatedQueues.find(q => q.nome === procedureName);

                if (!queue) {
                    queue = { procedimentoId: ticket.procedimento?.id || '', nome: procedureName, profissional: profissionalName, normal: [], preferencial: [] };
                    updatedQueues.push(queue);
                }

                const existsInQueue = ticket.type === "NORMAL"
                    ? queue.normal.some(t => t.code === ticket.code)
                    : queue.preferencial.some(t => t.code === ticket.code);

                if (!existsInQueue) {
                    if (ticket.type === "NORMAL") {
                        queue.normal.push(ticket);
                    } else if (ticket.type === "PREFERENCIAL") {
                        queue.preferencial.push(ticket);
                    }
                }

                return updatedQueues;
            });
        };

        socket.on("ticket:called", fetchData);
        socket.on("ticket:created", createdHandler);

        return () => {
            socket.off("ticket:called", fetchData);
            socket.off("ticket:created", createdHandler);
        };
    }, [user]);

    return (
        <>
            {
                loading ? (
                    <Loading />
                ) : (
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
                            {queues.map((queue) => (
                                <QueueCard key={queue.procedimentoId}>
                                    <SectionTitle>{queue.nome}</SectionTitle>
                                    <QueueSection>
                                        <SectionTitle>Fila Normal</SectionTitle>
                                        <QueueList>
                                            {queue.normal.map((item) => (
                                                <QueueItem key={item.id}>
                                                    <span>{item.code}</span>
                                                    <CallButton onClick={() => openModal(item.code!, queue.nome, queue.profissional, item.id!)}>Chamar</CallButton>
                                                </QueueItem>
                                            ))}
                                        </QueueList>
                                    </QueueSection>
                                    <QueueSection>
                                        <SectionTitle>Fila Preferencial</SectionTitle>
                                        <QueueList>
                                            {queue.preferencial.map((item) => (
                                                <QueueItem key={item.id}>
                                                    <span>{item.code}</span>
                                                    <CallButton onClick={() => openModal(item.code!, queue.nome, queue.profissional, item.id!)}>Chamar</CallButton>
                                                </QueueItem>
                                            ))}
                                        </QueueList>
                                    </QueueSection>
                                </QueueCard>
                            ))}
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
                                    maxWidth: '700px',
                                    width: '100%',
                                    padding: '2rem'
                                }
                            }}
                            contentLabel="Iniciar Atendimento"
                            ariaHideApp={false}
                        >
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    clientId: '',
                                    name: '',
                                    cpf: '',
                                    email: '',
                                    phone: '',
                                    rg: '',
                                    dataNascimento: '',
                                    logradouro: '',
                                    bairro: '',
                                    cidade: '',
                                    uf: '',
                                    num: '',
                                    preco: 0,
                                    metodoPagamento: '',
                                }}
                                validationSchema={
                                    Yup.object({
                                        clientId: Yup.string(),
                                        name: Yup.string().required('Obrigatório'),
                                        description: Yup.string(),
                                        preco: Yup.number().min(0),
                                        metodoPagamento: Yup.string(),
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
                                onSubmit={async (values) => {
                                    let clientId = values.clientId;

                                    const dataNascimento = values.dataNascimento
                                        ? new Date(values.dataNascimento)
                                        : null;

                                    const idade = dataNascimento ? calcularIdade(dataNascimento) : '';

                                    if (!clientId && values.name) {
                                        try {
                                            console.log(selectedClient);
                                            const newClient = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/clients/create`, {
                                                ...values,
                                                dataNascimento,
                                            }, {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${user!.accessToken}`
                                                }
                                            });
                                            clientId = newClient.data.id;
                                        } catch (err) {
                                            console.log('erro ao cadastrar cliente: ', err);
                                            return;
                                        }
                                    }

                                    const atendimentoData = {
                                        clientId,
                                        nome: values.name,
                                        preco: values.preco,
                                        metodoPagamento: values.metodoPagamento
                                    };

                                    console.log('Atendimento:', atendimentoData);

                                    gerarFichaAtendimento({
                                        //os: 'teste - 01',
                                        dataHora: new Date().toLocaleString(),
                                        descricao: selectedProcedimento,
                                        profissional: profissional,
                                        pagamento: values.metodoPagamento,
                                        paciente: values.name,
                                        nascimento: values.dataNascimento,
                                        idade: idade.toString(),
                                        logradouro: values.logradouro || '',
                                        bairro: values.bairro || '',
                                        cidade: values.cidade || '',
                                        telefone: values.phone || '',
                                        cpf: values.cpf || '',
                                        rg: values.rg || '',
                                        cep: '',
                                        uf: values.uf || '',
                                        numero: values.num || '',
                                        convenio: values.metodoPagamento || '',
                                    });

                                    alert('Ficha gerada e atendimento finalizado com sucesso!');

                                    finalizeTicket(user!, ticketId, closeModal);

                                    setQueues((prevQueues) => {
                                        return prevQueues.map(queue => {
                                            if (queue.nome === selectedProcedimento) {
                                                return {
                                                    ...queue,
                                                    normal: queue.normal.filter(t => t.code !== selectedSenha),
                                                    preferencial: queue.preferencial.filter(t => t.code !== selectedSenha),
                                                };
                                            }
                                            return queue;
                                        });
                                    });
                                }}
                            >
                                {
                                    ({ isSubmitting, setFieldValue }) => (
                                        <Form>
                                            <h2 style={{ marginBottom: '10px' }}>Senha: {selectedSenha}</h2>
                                            <h4 style={{ fontWeight: 'bold' }}>{selectedProcedimento}</h4>
                                            <h4 style={{ marginBottom: '10px', fontWeight: '500' }}>Profissional: {profissional}</h4>
                                            <p style={{ marginBottom: '10px' }}>Preencha os dados do atendimento:</p>

                                            <div style={{ display: 'flex', gap: '30px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <h3 style={{ marginBottom: '10px' }}>Dados do Cliente</h3>

                                                    <FormGroup>
                                                        <FormInputLabelRequired><FaUser />Nome</FormInputLabelRequired>
                                                        <Field
                                                            list="clientes"
                                                            name="name"
                                                            placeholder="Digite o nome"
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setFieldValue('name', e.target.value);
                                                                handleSelectClient(e.target.value, setFieldValue);
                                                            }}
                                                        />
                                                        <datalist id="clientes">
                                                            {clientes.map(cliente => (
                                                                <option key={cliente.id} value={cliente.name} />
                                                            ))}
                                                        </datalist>
                                                        <ErrorMessage name="name" component={ErrorText} />
                                                    </FormGroup>
                                                    <SubItensContainer style={{ gap: '10px' }}>
                                                        <Limitador>
                                                            <FormGroup>
                                                                <FormInputLabelRequired><FaIdCard />CPF</FormInputLabelRequired>
                                                                <Field type="text" name="cpf" />
                                                                <ErrorMessage name="cpf" component={ErrorText} />
                                                            </FormGroup>
                                                        </Limitador>
                                                        <FormGroup>
                                                            <FormInputLabel><FaIdCard />RG</FormInputLabel>
                                                            <Field type="text" name="rg" />
                                                        </FormGroup>
                                                    </SubItensContainer>
                                                    <SubItensContainer style={{ gap: '10px' }}>
                                                        <Limitador>
                                                            <FormGroup>
                                                                <FormInputLabel><FaCalendar />Nascimento</FormInputLabel>
                                                                <Field type="date" name="dataNascimento" />
                                                            </FormGroup>
                                                        </Limitador>
                                                        <FormGroup>
                                                            <FormInputLabelRequired><FaPhoneAlt />Telefone</FormInputLabelRequired>
                                                            <Field type="text" name="phone" />
                                                        </FormGroup>
                                                    </SubItensContainer>
                                                    <FormGroup>
                                                        <FormInputLabel><MdAlternateEmail />Email</FormInputLabel>
                                                        <Field type="email" name="email" />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <FormInputLabel><FaMapMarkedAlt />Logradouro</FormInputLabel>
                                                        <Field type="text" name="logradouro" />
                                                    </FormGroup>
                                                    <SubItensContainer style={{ gap: '10px' }}>
                                                        <Limitador>
                                                            <FormGroup>
                                                                <FormInputLabel><FaHashtag />Número</FormInputLabel>
                                                                <Field type="number" name="num" />
                                                            </FormGroup>
                                                        </Limitador>
                                                        <FormGroup>
                                                            <FormInputLabel><FaMapMarkedAlt />Bairro</FormInputLabel>
                                                            <Field type="text" name="bairro" />
                                                        </FormGroup>
                                                    </SubItensContainer>
                                                    <SubItensContainer style={{ gap: '10px' }}>
                                                        <Limitador>
                                                            <FormGroup>
                                                                <FormInputLabel><FaMapMarkedAlt />UF</FormInputLabel>
                                                                <Field type="text" name="uf" />
                                                            </FormGroup>
                                                        </Limitador>
                                                        <FormGroup>
                                                            <FormInputLabel><FaMapMarkedAlt />Cidade</FormInputLabel>
                                                            <Field type="text" name="cidade" />
                                                        </FormGroup>
                                                    </SubItensContainer>
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ marginBottom: '10px' }}>Dados do Procedimento</h3>

                                                    <FormGroup>
                                                        <FormInputLabel><FaMoneyBill /> Método de Pagamento:</FormInputLabel>
                                                        <Field as="select" name="metodoPagamento">
                                                            <option value="">Selecione</option>
                                                            <option value="DINHEIRO">Dinheiro</option>
                                                            <option value="PIX">Pix</option>
                                                            <option value="CARTAO">Cartão</option>
                                                            <option value="CONVENIO">Convênio</option>
                                                            <option value="SUS">SUS</option>
                                                        </Field>
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <FormInputLabel><FaMoneyBill /> Preço:</FormInputLabel>
                                                        <Field type="number" name="preco" placeholder="Preço" step="0.01" min="0" />
                                                    </FormGroup>
                                                </div>
                                            </div>

                                            <ButtonContainer>
                                                <Button type="submit" disabled={isSubmitting}>Gerar Ficha</Button>
                                                <Button type="button" onClick={() => recalLastTicket(user!, selectedSenha, selectedCounter)}>Chamar Novamente</Button>
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
                )
            }
        </>
    );
};

export default Atendimento;