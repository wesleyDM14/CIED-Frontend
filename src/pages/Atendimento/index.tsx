import { useState } from "react";
import {
    AtendimentoContainer,
    AutoCallButton,
    CallButton,
    QueueItem,
    QueueList,
    QueueSection,
    SectionTitle,
} from "./styles";
import { colors } from "../../utils/GlobalStyles";
import Modal from 'react-modal';

interface Queue {
    id: number;
    senha: string;
}

const Atendimento: React.FC = () => {
    // Dados fictícios
    const [normalQueue, setNormalQueue] = useState<Queue[]>([
        { id: 1, senha: 'N001' },
        { id: 2, senha: 'N002' },
        { id: 3, senha: 'N003' },
    ]);

    const [preferentialQueue, setPreferentialQueue] = useState<Queue[]>([
        { id: 1, senha: 'P001' },
        { id: 2, senha: 'P002' },
    ]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSenha, setSelectedSenha] = useState<string>('');

    const openModal = (senha: string) => {
        setSelectedSenha(senha);
        setModalOpen(true);
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

    return (
        <AtendimentoContainer>
            <QueueSection>
                <SectionTitle>Fila Normal</SectionTitle>
                <QueueList>
                    {normalQueue.map((item) => (
                        <QueueItem key={item.id}>
                            <span>{item.senha}</span>
                            <CallButton onClick={() => openModal(item.senha)}>Chamar</CallButton>
                        </QueueItem>
                    ))}
                </QueueList>
            </QueueSection>
            <QueueSection>
                <SectionTitle>Fila Preferencial</SectionTitle>
                <QueueList>
                    {preferentialQueue.map((item) => (
                        <QueueItem key={item.id}>
                            <span>{item.senha}</span>
                            <CallButton onClick={() => openModal(item.senha)}>Chamar</CallButton>
                        </QueueItem>
                    ))}
                </QueueList>
            </QueueSection>
            <AutoCallButton onClick={() => { }}>Chamar Próxima Senha</AutoCallButton>
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
                ariaHideApp={false} // Ajuste conforme sua configuração
            >
                <h2>Senha: {selectedSenha}</h2>
                <p>Preencha os dados do atendimento:</p>
                {/* Exemplo simples de formulário dentro da modal */}
                <form onSubmit={(e) => { e.preventDefault(); iniciarAtendimento(); }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Cliente: </label>
                        <input type="text" placeholder="Nome ou CPF" required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Método de Pagamento: </label>
                        <select required style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="">Selecione</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao">Cartão</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Procedimento: </label>
                        <input type="text" placeholder="Procedimento" required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Horário: </label>
                        <input type="time" required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CallButton type="submit">Agendar Atendimento</CallButton>
                        <CallButton onClick={closeModal} type="button" style={{ backgroundColor: colors.red, marginLeft: '1rem' }}>
                            Cancelar
                        </CallButton>
                    </div>
                </form>
            </Modal>
        </AtendimentoContainer >
    );
};

export default Atendimento;