import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Holidays from 'date-holidays'

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
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100">
                    <ChevronLeft size={18} />
                </button>

                <h3 className="font-semibold text-sm capitalize">
                    {monthLabel}
                </h3>

                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
                {dayNames.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm">
                {cells.map((day, i) => {
                    if (!day) return <div key={i} className="h-8" />

                    const event = getEvent(day)
                    const national = isNationalHoliday(day)

                    const isToday =
                        today.getDate() === day &&
                        today.getMonth() === month &&
                        today.getFullYear() === year

                    let color = 'hover:bg-gray-100'

                    if (event?.jenis_hari === 'event')
                        color = 'bg-blue-100 text-blue-600 font-semibold'

                    if (event?.jenis_hari === 'cuti')
                        color = 'bg-yellow-100 text-yellow-700 font-semibold'

                    if (national)
                        color = 'bg-red-100 text-red-700 font-semibold'

                    if (isToday)
                        color = 'bg-emerald-600 text-white font-bold'

                    return (
                        <div
                            key={i}
                            title={
                                national?.name ||
                                event?.keterangan ||
                                ''
                            }
                            className={`
                h-8 flex items-center justify-center rounded-md
                ${color}
            `}
                        >
                            {day}
                        </div>
                    )
                })}

            </div>


            <div className="flex flex-wrap gap-4 text-xs mt-5 text-gray-500">
                <Legend color="bg-emerald-600" label="Hari Ini" />
                <Legend color="bg-yellow-400" label="Libur Kantor" />
                <Legend color="bg-red-400" label="Libur Nasional" />
                <Legend color="bg-blue-400" label="Event" />
            </div>

        </div>
    )
}


function Legend({ color, label }: any) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${color}`} />
            {label}
        </div>
    )
}
