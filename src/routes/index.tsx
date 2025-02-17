import { Routes, Route } from "react-router-dom";

import BasicRoute from "../components/BasicRoute";
//import AuthRoute from "../components/AuthRoute";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<BasicRoute><Home /></BasicRoute>} />
        <Route path="/dashboard" element={<BasicRoute><MainLayout><Dashboard /></MainLayout></BasicRoute>} />
    </Routes>
);

export default AppRoutes;