export default function MiniCalendar({ events = [] }: any) {
    const today = new Date()

    const isHoliday = (day: number) =>
        events.find(
            (e: any) =>
                new Date(e.tanggal).getDate() === day &&
                e.jenis_hari === 'cuti'
        )

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Kalender</h3>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {[...Array(31)].map((_, i) => {
                    const day = i + 1
                    const holiday = isHoliday(day)

                    return (
                        <div
                            key={day}
                            className={`py-1 rounded
                            ${holiday ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100'}`}
                        >
                            {day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
