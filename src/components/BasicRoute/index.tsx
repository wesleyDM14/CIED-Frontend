import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface BasicRouteProps {
    children: React.ReactNode;
}

const BasicRoute: React.FC<BasicRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.session.isAuthenticated);

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default BasicRoute;