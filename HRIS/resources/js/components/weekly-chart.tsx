import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

export default function WeeklyChart({ data }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-[320px]">
            <h3 className="font-semibold mb-4">Kehadiran Mingguan</h3>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hadir" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
