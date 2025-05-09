import { Routes, Route } from "react-router-dom";

import BasicRoute from "../components/BasicRoute";
import AuthRoute from "../components/AuthRoute";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import NotAuthorized from "../pages/NotAuthorized";
import NotFound from "../pages/NotFound";
import Clientes from "../pages/Clientes";
import Users from "../pages/Users";
import Perfil from "../pages/Perfil";
import Atendimento from "../pages/Atendimento";
import Painel from "../pages/Painel";
import Procedimentos from "../pages/Procedimentos";
import Agenda from "../pages/Agenda";
import Senha from "../pages/Senha";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<BasicRoute><Home /></BasicRoute>} />
        <Route path="/dashboard" element={<AuthRoute><MainLayout><Dashboard /></MainLayout></AuthRoute>} />
        <Route path="/agenda" element={<AuthRoute><MainLayout><Agenda /></MainLayout></AuthRoute>} />
        <Route path="/atendimento" element={<AuthRoute><MainLayout><Atendimento /></MainLayout></AuthRoute>} />
        <Route path="/clientes" element={<AuthRoute><MainLayout><Clientes /></MainLayout></AuthRoute>} />
        <Route path="/usuarios" element={<AuthRoute><MainLayout><Users /></MainLayout></AuthRoute>} />
        <Route path="/painel" element={<AuthRoute><Painel /></AuthRoute>} />
        <Route path='/perfil' element={<AuthRoute><MainLayout><Perfil /></MainLayout></AuthRoute>} />
        <Route path='/procedimentos' element={<AuthRoute><MainLayout><Procedimentos /></MainLayout></AuthRoute>} />
        <Route path='/senhas' element={<AuthRoute><MainLayout><Senha /></MainLayout></AuthRoute>} />
        <Route path='/not-authorized' element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;