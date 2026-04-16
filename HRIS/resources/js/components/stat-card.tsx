import { ReactNode } from 'react'

interface Props {
    title: string
    value: string | number
    subtitle?: string
    icon?: ReactNode
}

export default function StatCard({ title, value, subtitle, icon }: Props) {
    return (
        <div className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-lg hover:border-red-100 transform hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer">
            <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-red-50/40 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-[100px] transition-all duration-700 pointer-events-none group-hover:scale-125" />
            
            <div className="relative z-10">
                <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wider font-bold group-hover:text-red-600 transition-colors">{title}</p>
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{value}</h2>
                {subtitle && (
                    <p className="text-[11px] text-gray-400 mt-1.5 group-hover:text-gray-500 transition-colors">{subtitle}</p>
                )}
            </div>

            {icon && (
                <div className="relative z-10 p-3.5 rounded-xl bg-gray-50/80 text-gray-500 group-hover:bg-red-100 group-hover:text-[#B50B08] group-hover:shadow-[0_0_15px_rgba(181,11,8,0.2)] transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-6">
                    {icon}
                </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-400 to-[#B50B08] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left pointer-events-none" />
        </div>
    )
}
