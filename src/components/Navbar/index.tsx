import { useState } from "react";
import {
    DropDownMenu,
    DropDownMenuIndicator,
    DropDownMenuItem,
    LeftContainer,
    NavbarAvatar,
    NavbarContainer,
    NavbarItemContainer,
    NavbarItemLabel,
    NavbarLogo,
    NavbarShowIcon,
    RightContainer,
} from "./styles";
import { FaBars, FaPowerOff } from "react-icons/fa";
import { colors } from "../../utils/GlobalStyles";
import logo from '../../../public/favicon.ico';
import userImg from '../../assets/user.png';
import { AppDispatch } from "../../store";

interface NavbarProps {
    openSidebar: () => void;
    logoutUser: (navigate: (path: string) => void, dispatch: AppDispatch) => void;
    navigate: (path: string) => void;
    dispatch: AppDispatch;
}

const Navbar: React.FC<NavbarProps> = ({ openSidebar, logoutUser, navigate, dispatch }) => {

    const [open, setOpen] = useState(false);

    return (
        <NavbarContainer>
            <NavbarShowIcon onClick={() => openSidebar()}>
                <FaBars />
            </NavbarShowIcon>
            <LeftContainer>
                <NavbarLogo src={logo} alt='Logo da empresa' onClick={() => navigate('/dashboard')} />
                <NavbarItemLabel onClick={() => navigate('/dashboard')}>Atendimento CIED</NavbarItemLabel>
            </LeftContainer>
            <RightContainer>
                <NavbarItemContainer>
                    <NavbarAvatar $image={userImg} onClick={() => setOpen(!open)} />
                    {
                        open && (
                            <DropDownMenu>
                                <DropDownMenuIndicator />
                                <DropDownMenuItem onClick={() => navigate('/perfil')}>Meu Perfil</DropDownMenuItem>
                                <DropDownMenuItem onClick={() => logoutUser(navigate, dispatch)} color={colors.red}> <FaPowerOff style={{ marginRight: '5px' }} /> Logout</DropDownMenuItem>
                            </DropDownMenu>
                        )
                    }
                </NavbarItemContainer>
            </RightContainer>
        </NavbarContainer>
    );
}

export default Navbar;