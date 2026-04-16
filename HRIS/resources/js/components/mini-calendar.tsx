import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import Holidays from 'date-holidays'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function MiniCalendar({ events = [] }: any) {
    const [current, setCurrent] = useState(new Date())

    const year = current.getFullYear()
    const month = current.getMonth()

    const today = new Date()

    const holidays = useMemo(() => {
        const hd = new Holidays('ID')
        return hd.getHolidays(year)
    }, [year])

    const isNationalHoliday = (day: number) => {
        return holidays.find((h: any) => {
            const d = new Date(h.date)
            return d.getDate() === day && d.getMonth() === month
        })
    }

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Offset penyesuaian hari Senin sebagai hari pertama
    const offset = (firstDay + 6) % 7

    const monthLabel = current.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
    })

    const prevMonth = () =>
        setCurrent(new Date(year, month - 1, 1))

    const nextMonth = () =>
        setCurrent(new Date(year, month + 1, 1))

    const getEvent = (day: number) =>
        events.find((e: any) => {
            const d = new Date(e.tanggal)
            return (
                d.getDate() === day &&
                d.getMonth() === month &&
                d.getFullYear() === year
            )
        })

    const cells: (number | null)[] = []

    for (let i = 0; i < offset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length < 42) cells.push(null)

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 xl:p-8 flex flex-col h-full hover:shadow-md hover:border-red-100 transition-all duration-300 relative overflow-hidden">

            {/* Dekorasi Background */}
            <div className="absolute -right-8 -top-8 text-red-50 opacity-50 transform rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                <CalendarIcon size={150} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex items-center justify-between mb-8">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 hover:text-[#B50B08] hover:shadow-sm transition-all duration-300 active:scale-95"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex flex-col items-center">
                    <h3 className="font-extrabold text-gray-800 tracking-tight capitalize px-4 text-base">
                        {monthLabel}
                    </h3>
                </div>

                <button
                    onClick={nextMonth}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 hover:text-[#B50B08] hover:shadow-sm transition-all duration-300 active:scale-95"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="relative z-10 grid grid-cols-7 text-xs font-bold text-gray-400 mb-4 text-center">
                {dayNames.map((d, idx) => (
                    <div key={d} className={`${idx >= 5 ? 'text-red-500' : ''}`}>{d}</div>
                ))}
            </div>

            <div className="relative z-10 grid grid-cols-7 gap-y-2 gap-x-1 text-sm font-medium">
                {cells.map((day, i) => {
                    if (!day) return <div key={i} className="h-9 w-9 mx-auto" />

                    const event = getEvent(day)
                    const national = isNationalHoliday(day)

                    const isToday =
                        today.getDate() === day &&
                        today.getMonth() === month &&
                        today.getFullYear() === year

                    let color = 'text-gray-600 hover:bg-gray-100'
                    let glow = ''

                    if (event?.jenis_hari === 'event') {
                        color = 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 font-bold'
                    }

                    if (event?.jenis_hari === 'cuti') {
                        color = 'bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-100 font-bold'
                    }

                    if (national) {
                        color = 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold'
                    }

                    // Hari ini nimpa semua styling
                    if (isToday) {
                        color = 'bg-emerald-500 text-white hover:bg-emerald-600 font-bold'
                        glow = 'shadow-[0_4px_10px_rgba(16,185,129,0.4)] ring-2 ring-emerald-100'
                    }

                    const tooltipText = national?.name || event?.keterangan || (isToday ? 'Hari Ini' : '')
                    const isWeekend = (i % 7 === 5) || (i % 7 === 6)

                    if (isWeekend && color === 'text-gray-600 hover:bg-gray-100') {
                        color = 'text-red-500 hover:bg-red-50 font-medium'
                    }

                    const dayCell = (
                        <div
                            className={`
                                h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-xl transition-all duration-300
                                ${color} ${glow} cursor-pointer hover:scale-110 active:scale-95
                                ${glow ? 'relative z-20' : ''}
                            `}
                        >
                            {day}
                            {/* Dot indicator untuk hari event yang bukan hari libur spesifik jika diperlukan */}
                            {(event && !isToday && color.includes('text-gray-600')) && (
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-0.5"></span>
                            )}
                        </div>
                    )

                    return (
                        <div key={i} className="flex justify-center">
                            {tooltipText ? (
                                <TooltipProvider delayDuration={150}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>{dayCell}</TooltipTrigger>
                                        <TooltipContent side="top" className="bg-gray-800 border-none text-white text-xs px-3 py-1.5 shadow-xl font-medium rounded-lg">
                                            {tooltipText}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                dayCell
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="relative z-10 flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] font-semibold mt-auto pt-6 border-t border-gray-100 text-gray-500">
                <Legend color="bg-emerald-500 shadow-[0_2px_5px_rgba(16,185,129,0.3)]" label="Hari Ini" />
                <Legend color="bg-yellow-400 border border-yellow-200" label="Cuti/Izin" />
                <Legend color="bg-red-400 border border-red-200" label="Libur / Akhir Pekan" />
                <Legend color="bg-blue-400 border border-blue-200" label="Event" />
            </div>
        </div>
    )
}

function Legend({ color, label }: any) {
    return (
        <div className="flex items-center gap-2 group cursor-default">
            <span className={`w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125 ${color}`} />
            <span className="group-hover:text-gray-800 transition-colors">{label}</span>
        </div>
    )
}
