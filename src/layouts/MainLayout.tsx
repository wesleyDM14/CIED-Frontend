import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { logoutUser } from "../services/authService";
import Sidebar from "../components/Sidebar";
import * as React from "react";

interface User {
    accessToken: string;
    userRole: string;
    loginTime: number;
}

interface RootState {
    session: {
        user: User | null;
    };
}
interface MainLayoutProps {
    children: React.ReactElement<{ navigate: ReturnType<typeof useNavigate>, user: User | null }>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.session.user);

    const openSidebar = () => {
        setSidebarOpen(true);
    }

    const closeSidebar = () => {
        setSidebarOpen(false);
    }

    return (
        <div className="main-container">
            <Navbar
                logoutUser={logoutUser}
                openSidebar={openSidebar}
                navigate={navigate}
                dispatch={dispatch}
            />
            <main>
                {React.cloneElement(children, { navigate, user })}
            </main>
            <Sidebar
                sidebarOpen={sidebarOpen}
                closeSidebar={closeSidebar}
                navigate={navigate}
                logoutUser={logoutUser}
                user={user}
                dispatch={dispatch}
            />
        </div>
    )
}

export default MainLayout;