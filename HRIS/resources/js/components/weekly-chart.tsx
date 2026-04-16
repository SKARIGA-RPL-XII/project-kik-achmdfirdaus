import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'
import { Activity } from 'lucide-react'

export default function WeeklyChart({ data = [] }: any) {
    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[340px] flex flex-col hover:shadow-lg hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 group-hover:text-[#B50B08] transition-colors duration-300 flex items-center gap-2">
                    <Activity size={14} className="text-gray-300 group-hover:text-[#B50B08] transition-colors" />
                    Kehadiran Mingguan
                </h3>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-400 transition-colors duration-300 animate-pulse delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-500 transition-colors duration-300 animate-pulse delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-600 transition-colors duration-300 animate-pulse delay-300" />
                </div>
            </div>

            <div className="flex-1 transition-transform duration-500 group-hover:scale-[1.02] relative z-10 w-[calc(100%+16px)] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} dx={-10} />

                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                            itemStyle={{ color: '#B50B08' }}
                            cursor={{ stroke: '#B50B08', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />

                        <Line
                            type="monotone"
                            dataKey="hadir"
                            name="Hadir"
                            stroke="#B50B08"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#B50B08' }}
                            activeDot={{ r: 6, stroke: '#B50B08', strokeWidth: 2, fill: '#fff' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-[#B50B08]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-center pointer-events-none" />
        </div>
    )
}
