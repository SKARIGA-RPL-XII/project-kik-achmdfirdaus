import { Users, AlertTriangle, CalendarX, CheckCircle } from 'lucide-react'
import { router } from '@inertiajs/react'

import StatCard from '@/components/stat-card'
import MiniCalendar from '@/components/mini-calendar'
import WorkClock from '@/components/clock'
import { Button } from '@/components/ui/button'
import AbsenCard from '../absen-card'

export default function UserDashboard(props: any) {

    const stats = props.userStats ?? {
        hadir: 0,
        hariKerja: 0,
        pelanggaran: 0,
        cuti: 0,
        alpha: 0,
    }

    const kalender = props.kalender ?? []
    const absen = props.absen ?? {}

    const sudahMasuk = !!absen?.jam_masuk
    const sudahPulang = !!absen?.jam_pulang


    function absenMasuk() {
        router.post('/app/absensi/checkin')
    }

    function absenPulang() {
        router.post('/app/absensi/checkout')
    }

    return (
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                <StatCard
                    title="Kehadiran"
                    value={`${stats.hadir} / ${stats.hariKerja}`}
                    icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
                />

                <StatCard
                    title="Pelanggaran"
                    value={stats.pelanggaran}
                    icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                />

                <StatCard
                    title="Cuti / Izin"
                    value={stats.cuti}
                    icon={<Users className="w-5 h-5 text-blue-600" />}
                />

                <StatCard
                    title="Alpha"
                    value={stats.alpha}
                    icon={<CalendarX className="w-5 h-5 text-orange-600" />}
                />

            </div>
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                <AbsenCard absen={absen} />
                <MiniCalendar events={kalender} />

            </div>



        </div>
    )
}
