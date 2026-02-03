import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'

import { Users, AlertTriangle, Clock } from 'lucide-react'
import StatCard from '@/components/stat-card'
import TodayAttendance from '@/components/attendace'
import WeeklyChart from '@/components/weekly-chart'
import MiniCalendar from '@/components/mini-calendar'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: dashboard().url },
]

export default function Dashboard(props: any) {

    const stats = props.stats ?? {
        hadirBulanIni: 0,
        pelanggaranBulanIni: 0,
        pendingTotal: 0,
    }

    const today = props.today ?? { hadir: 0, total: 0 }
    const weeklyData = props.weeklyData ?? []
    const kalender = props.kalender ?? []

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 space-y-6">

                <div className="grid md:grid-cols-3 gap-4">
                    <StatCard
                        title="Kehadiran Bulan Ini"
                        value={stats.hadirBulanIni}
                        icon={<Users />}
                    />

                    <StatCard
                        title="Pelanggaran Bulan Ini"
                        value={stats.pelanggaranBulanIni}
                        icon={<AlertTriangle />}
                    />

                    <StatCard
                        title="Pengajuan Pending"
                        value={stats.pendingTotal}
                        icon={<Clock />}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <TodayAttendance data={today} />
                        <WeeklyChart data={weeklyData} />
                    </div>

                    <MiniCalendar events={kalender} />
                </div>
            </div>
        </AppLayout>
    )
}
