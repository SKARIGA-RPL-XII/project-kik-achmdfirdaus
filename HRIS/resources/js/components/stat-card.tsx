import { ReactNode } from 'react'

interface Props {
    title: string
    value: string | number
    subtitle?: string
    icon?: ReactNode
}

export default function StatCard({ title, value, subtitle, icon }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-400 mb-1">{title}</p>
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                )}
            </div>

            {icon && (
                <div className="p-3 rounded-xl bg-gray-50">
                    {icon}
                </div>
            )}
        </div>
    )
}
