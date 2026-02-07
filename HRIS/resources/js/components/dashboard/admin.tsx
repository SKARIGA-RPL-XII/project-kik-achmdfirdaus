import { Users, AlertTriangle, Clock } from 'lucide-react'
import StatCard from '@/components/stat-card'
import TodayAttendance from '@/components/attendace'
import WeeklyChart from '@/components/weekly-chart'
import MiniCalendar from '@/components/mini-calendar'
import WorkClock from '../clock'

export default function AdminDashboard(props: any) {

    const stats = props.stats ?? {
        hadirBulanIni: 0,
        pelanggaranBulanIni: 0,
        pendingTotal: 0,
    }

    const today = props.today ?? { hadir: 0, total: 0 }
    const weeklyData = props.weeklyData ?? []
    const kalender = props.kalender ?? []

    return (
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Kehadiran Bulan Ini"
                    value={stats.hadirBulanIni}
                    icon={<Users className="w-5 h-5 text-emerald-600" />}
                />

                <StatCard
                    title="Pelanggaran Bulan Ini"
                    value={stats.pelanggaranBulanIni}
                    icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                />

                <StatCard
                    title="Pengajuan Pending"
                    value={stats.pendingTotal}
                    icon={<Clock className="w-5 h-5 text-amber-600" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ================= LEFT AREA ================= */}
                <div className="lg:col-span-2 grid gap-8">

                    {/* ROW 1 : Today + Clock */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <TodayAttendance data={today} />
                        <WorkClock />
                    </div>

                    {/* ROW 2 : Weekly full width */}
                    <WeeklyChart data={weeklyData} />
                </div>


                {/* ================= RIGHT AREA ================= */}
                <MiniCalendar events={kalender} />

            </div>


        </div>
    )
}
