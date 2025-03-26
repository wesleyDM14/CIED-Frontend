import axios from "axios";
import { User } from "../contexts/interfaces";

export const getDashboardData = async (
    user: User,
    setDailyData: (data: { day: string; atendimentos: number }[]) => void,
    setAttendanceBreakdown: (data: { type: string; count: number }[]) => void,
    setStatusDistribution: (data: { status: string, count: number }[]) => void,
    setAverageAttendances: (value: number) => void,
    setTotalTickets: (data: number) => void,
    setLoading: (loading: boolean) => void
) => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tickets/dashboard-summary`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        }
    }).then((response) => {
        const { dailyData, attendanceBreakdown, averageAttendances, statusDistribution, totalTickets } = response.data;
        setDailyData(dailyData);
        setAttendanceBreakdown(attendanceBreakdown);
        setAverageAttendances(parseFloat(averageAttendances));
        setStatusDistribution(statusDistribution);
        setTotalTickets(totalTickets);
    }).catch((err) => {
        console.error(err.response.data.error);
        window.alert(err.response.data.error);
    }).finally(() => {
        setLoading(false);
    });
};