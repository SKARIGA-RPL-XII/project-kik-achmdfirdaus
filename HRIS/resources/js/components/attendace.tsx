export default function TodayAttendance({ data }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Absen Hari Ini</h3>

            <div className="text-center">
                <h2 className="text-3xl font-bold text-emerald-600">
                    {data.hadir} / {data.total}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Karyawan Hadir Hari Ini
                </p>
            </div>
        </div>
    )
}
