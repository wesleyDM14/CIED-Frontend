import { Routes, Route } from "react-router-dom";

import BasicRoute from "../components/BasicRoute";
import AuthRoute from "../components/AuthRoute";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import NotAuthorized from "../pages/NotAuthorized";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<BasicRoute><Home /></BasicRoute>} />
        <Route path="/dashboard" element={<AuthRoute><MainLayout><Dashboard /></MainLayout></AuthRoute>} />
        <Route path='/not-authorized' element={<NotAuthorized />} />
    </Routes>
);

export default AppRoutes;