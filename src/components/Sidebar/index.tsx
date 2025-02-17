import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../store";
import {
    Avatar,
    CloseContainer,
    LogoutContainer,
    LogoutTitle,
    MenuContainer,
    MenuItemContainer,
    MenuItemTilte,
    MenuTitleSection,
    Title,
    TitleContainer,
} from "./styles";
import { FaPowerOff, FaTimes, FaUsers } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import { TbUsersGroup } from "react-icons/tb";
import { BiSolidUserRectangle } from 'react-icons/bi';
import { LuLayoutDashboard } from 'react-icons/lu';
import * as React from "react";
import { hasPermission } from "../../utils/Permissions";
import logo from '../../../public/favicon.ico';
import { User } from "../../contexts/interfaces";

interface SidebarProps {
    sidebarOpen: boolean;
    closeSidebar: () => void;
    logoutUser: (navigate: NavigateFunction, dispatch: AppDispatch) => void;
    navigate: NavigateFunction;
    user: User | null;
    dispatch: AppDispatch;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, closeSidebar, logoutUser, navigate, user, dispatch }) => {
    const userRole = user?.userRole || 'OPERATOR';

    const menuSections = [
        {
            title: 'Administrativo',
            items: [
                { path: '/atendimento', title: 'Atendimento', icon: <RiCustomerServiceFill /> },
                { path: '/clientes', title: 'Clientes', icon: <TbUsersGroup /> },
                { path: '/usuarios', title: 'Usuários', icon: <FaUsers /> },
                { path: '/painel', title: 'Painel de Atendimento', icon: <LuLayoutDashboard /> },
            ],
        },
        {
            title: 'Pessoal',
            items: [
                { path: '/perfil', title: 'Perfil', icon: <BiSolidUserRectangle /> },
            ],
        },
    ];

    return (
        <div className={sidebarOpen ? 'sidebar-responsive' : ''} id="sidebar">
            <TitleContainer>
                <Avatar src={logo} alt="Logo da Empresa" onClick={() => navigate('/dashboard')} />
                <Title>Atendimento CIED</Title>
                <CloseContainer>
                    <FaTimes onClick={() => closeSidebar()} aria-hidden={true} />
                </CloseContainer>
            </TitleContainer>
            <MenuContainer>
                {menuSections.map((section) => {
                    const visibleItems = section.items.filter(item => hasPermission(userRole, item.path));

                    if (visibleItems.length === 0) return null;

                    return (
                        <React.Fragment key={section.title}>
                            <MenuTitleSection>{section.title}</MenuTitleSection>
                            {visibleItems.map((item) => (
                                <MenuItemContainer key={item.path} onClick={() => navigate(item.path)}>
                                    {item.icon}
                                    <MenuItemTilte>{item.title}</MenuItemTilte>
                                </MenuItemContainer>
                            ))}
                        </React.Fragment>
                    );
                })}
                <LogoutContainer>
                    <FaPowerOff onClick={() => logoutUser(navigate, dispatch)} />
                    <LogoutTitle onClick={() => logoutUser(navigate, dispatch)}>Logout</LogoutTitle>
                </LogoutContainer>
            </MenuContainer>
        </div>
    );
}

export default Sidebar;