import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface AuthRouteProps {
    children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.session.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    return children;
}

export default AuthRoute;