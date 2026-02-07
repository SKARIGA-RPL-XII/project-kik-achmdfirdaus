import WorkClock from '@/components/clock'

export default function TodayAttendance({ data }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">

            <h3 className="font-semibold mb-4">
                Absen Hari Ini
            </h3>

            <div className="grid grid-cols-2 gap-6 items-center">

                <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-600">
                        {data.hadir} / {data.total}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Karyawan Hadir Hari Ini
                    </p>
                </div>
            </div>

        </div>
    )
}
