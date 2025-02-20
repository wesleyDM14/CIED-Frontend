import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
    CardTitle,
    CardValue,
    ChartCard,
    ChartContainer,
    DashboardContainer,
    SummaryCard,
} from "./styles";
import { colors } from "../../utils/GlobalStyles";

const Dashboard: React.FC = () => {
    // Dados fictícios para atendimentos diários
    const dailyData = [
        { day: 'Seg', atendimentos: 10 },
        { day: 'Ter', atendimentos: 12 },
        { day: 'Qua', atendimentos: 8 },
        { day: 'Qui', atendimentos: 15 },
        { day: 'Sex', atendimentos: 9 },
        { day: 'Sáb', atendimentos: 7 },
        { day: 'Dom', atendimentos: 5 }
    ];

    // Dados fictícios para a distribuição de atendimentos
    const attendanceBreakdown = [
        { type: 'Normal', count: 50 },
        { type: 'Preferencial', count: 20 }
    ];

    const pieColors = [colors.btnPrimary, colors.btnSecondary];

    // Cálculo da média de atendimentos
    const totalAtendimentos = dailyData.reduce((acc, cur) => acc + cur.atendimentos, 0);
    const averageAttendances = Math.round(totalAtendimentos / dailyData.length);

    return (
        <DashboardContainer>
            <SummaryCard>
                <CardTitle>Média de Atendimentos por Dia</CardTitle>
                <CardValue>{averageAttendances}</CardValue>
            </SummaryCard>
            <ChartContainer>
                <ChartCard>
                    <h3 style={{ color: colors.title, textAlign: 'center' }}>Atendimentos Diários</h3>
                    <ResponsiveContainer width="100%" height="100%">
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
                    <h3 style={{ color: colors.title, textAlign: 'center' }}>Distribuição de Atendimentos</h3>
                    <ResponsiveContainer width="100%" height="100%">
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
                                {attendanceBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartContainer>
        </DashboardContainer>
    );
};

export default Dashboard;