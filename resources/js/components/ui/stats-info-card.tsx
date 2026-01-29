import React from 'react'

type StatsInfoCardProps = {
    title: string
    value: number | string
    valueLabel: string
    subtitle: string
    icon: React.ReactNode
}

export default function StatsInfoCard({
    title,
    value,
    valueLabel,
    subtitle,
    icon,
}: StatsInfoCardProps) {

    const currentMonth = new Date().toLocaleString('id-ID', {
        month: 'long',
    })

    return (
        <div className="w-full rounded-xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#115E59] text-white">
                        {icon}
                    </div>
                    <h3 className="text-base font-medium text-slate-900">
                        {title}
                    </h3>
                </div>

                <div className="rounded-full bg-[#115E59] px-4 py-1 text-xs font-semibold text-white shadow-sm shadow-emerald-900/20 capitalize">
                    {currentMonth}
                </div>
            </div>

            <div className="flex items-baseline flex-wrap gap-2">
                <span className="text-3xl font-bold text-slate-900">
                    {value}
                </span>
                <span className="text-xl font-semibold text-slate-900 mr-2">
                    {valueLabel}
                </span>
                <span className="text-sm text-slate-400 font-normal">
                    {subtitle}
                </span>
            </div>
        </div>
    )
}
