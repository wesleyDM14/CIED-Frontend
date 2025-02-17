import { useEffect, useState } from "react";
import {
    AddClientButton,
    AddClientContainer,
    AddIcon,
    AddText,
    ClientContent,
    ClientHeader,
    ClientsContainer,
    ClientTitle,
    IconWrapper,
    NoContentActionContainer,
    NoContentContainer,
    TextContent,
} from "./styles";
import Loading from "../../components/Loading";
import { FaPlus, FaPlusCircle, FaUsers } from "react-icons/fa";
import { Cliente, PageProps } from "../../contexts/interfaces";
import SearchBar from "../../components/SearchBar";
import { colors } from "../../utils/GlobalStyles";
import { getClients } from "../../services/clientService";

const Clientes: React.FC<PageProps> = ({ navigate, user }) => {

    const [clients, setClients] = useState<Cliente[]>([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    /*const [page, setPage] = useState(1);
    const itemsPerPage = 10;*/

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
                            <AddClientContainer onClick={() => navigate!('/clientes/novo')}>
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
                                            <AddClientButton onClick={() => navigate!('/clientes/novo')}>
                                                <FaPlus color={colors.icon} fontSize={15} className="icon-add-button" /> Novo Cliente
                                            </AddClientButton>
                                        </NoContentActionContainer>
                                    </NoContentContainer>
                                ) : (
                                    <></>
                                )
                            }
                        </ClientContent>
                    </>
                )
            }
        </ClientsContainer>
    );
};

export default Clientes;