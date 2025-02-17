import { FaExclamationTriangle } from "react-icons/fa";
import { BackButton, IconWrapper, Message, NotFoundContainer, Title } from "./styles";

const NotFound = () => {
    return (
        <NotFoundContainer>
            <Title>
                <IconWrapper>
                    <FaExclamationTriangle />
                </IconWrapper>
                404 - Página Não Encontrada
            </Title>
            <Message>
                Desculpe, a página que você está procurando não existe ou foi movida. Por favor, verifique a URL ou volte para a página inicial.
            </Message>
            <BackButton onClick={() => window.location.href = '/'}>
                Voltar para a página inicial
            </BackButton>
        </NotFoundContainer>
    );
};

export default NotFound;