import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { hasPermission } from "../../utils/Permissions";

interface AuthRouteProps {
    children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.session.isAuthenticated);
    const userRole = useSelector((state: RootState) => state.session.userRole);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    if (!hasPermission(userRole as string, location.pathname)) {
        console.log(userRole);
        return <Navigate to="/not-authorized" />
    }

    return children;
}

export default AuthRoute;