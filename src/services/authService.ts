import axios from "axios";
import { login, logout } from "../reducers/sessionSlice";
import { AppDispatch } from "../store";

interface Credentials {
    email: string;
    password: string;
}

export const loginUser = async (
    credentials: Credentials,
    navigate: (path: string) => void,
    setIsLoading: (loading: boolean) => void,
    dispatch: AppDispatch
) => {
    try {
        setIsLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, credentials, {
            headers: { "Content-Type": "application/json" },
        });

        const { accessToken, userRole } = response.data;

        const userData = {
            accessToken,
            userRole,
            loginTime: new Date().getTime(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(login(userData));

        navigate("/dashboard");
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            const errorMessage = (error.response.data as { error?: string }).error || "Erro ao fazer login.";
            window.alert(errorMessage);
        } else {
            window.alert("Erro ao fazer login.");
        }
    } finally {
        setIsLoading(false);
    }
};

export const logoutUser = (navigate: (path: string) => void, dispatch: AppDispatch) => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/");
}