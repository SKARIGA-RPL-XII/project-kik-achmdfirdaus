import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'

export default function WeeklyChart({ data = [] }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 h-[340px] flex flex-col">

            <h3 className="font-semibold mb-4">
                Kehadiran Mingguan
            </h3>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="hadir"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
