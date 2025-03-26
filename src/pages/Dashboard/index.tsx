import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    CardTitle,
    CardValue,
    ChartCard,
    ChartContainer,
    DashboardContainer,
    Header,
    SummaryCard,
    SummaryWrapper,
    Title,
} from "./styles";
import { colors } from "../../utils/GlobalStyles";
import { GrDashboard } from 'react-icons/gr';
import { PageProps } from "../../contexts/interfaces";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";
import Loading from "../../components/Loading";

const Dashboard: React.FC<PageProps> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [dailyData, setDailyData] = useState<{ day: string, atendimentos: number }[]>([]);
    const [attendanceBreakdown, setAttendanceBreakdown] = useState<{ type: string, count: number }[]>([]);
    const [statusDistribution, setStatusDistribution] = useState<{ status: string, count: number }[]>([]);
    const [averageAttendances, setAverageAttendances] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);

    const pieColors = [colors.btnPrimary, colors.btnSecondary];
    const statusColors = [colors.greenNeutral, colors.red, colors.icon];

    useEffect(() => {
        if (loading) {
            getDashboardData(user!, setDailyData, setAttendanceBreakdown, setStatusDistribution, setAverageAttendances, setTotalTickets, setLoading);
        }
    }, [loading, user]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <DashboardContainer>
                    <Header>
                        <Title><GrDashboard />Bem vindo ao sistema de Atendimento da CIED!</Title>
                    </Header>

                    <SummaryWrapper>
                        <SummaryCard>
                            <CardTitle>Total de Senhas</CardTitle>
                            <CardValue>{totalTickets}</CardValue>
                        </SummaryCard>

                        <SummaryCard>
                            <CardTitle>Média Diária</CardTitle>
                            <CardValue>{averageAttendances}</CardValue>
                        </SummaryCard>
                    </SummaryWrapper>

                    <ChartContainer>
                        <ChartCard>
                            <h3 style={{ color: colors.title, textAlign: 'center' }}>Atendimentos por Dia da Semana</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.slimGray} />
                                    <XAxis dataKey="day" stroke={colors.mainText} />
                                    <YAxis stroke={colors.mainText} />
                                    <Tooltip />
                                    <Bar dataKey="atendimentos" fill={colors.btnPrimary} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard>
                            <h3 style={{ color: colors.title, textAlign: 'center' }}>Distribuição por Tipo</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={attendanceBreakdown}
                                        dataKey="count"
                                        nameKey="type"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {attendanceBreakdown.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard>
                            <h3 style={{ color: colors.title, textAlign: 'center' }}>Status das Senhas</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {statusDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </ChartContainer>
                </DashboardContainer>
            )}
        </>
    );
};

export default Dashboard;