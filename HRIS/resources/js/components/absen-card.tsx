import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'
import WorkClock from './clock'

export default function AbsenCard({ absen }: any) {
    const sudahMasuk = !!absen?.jam_masuk
    const sudahPulang = !!absen?.jam_pulang

    function masuk() {
        router.post('/app/absensi/masuk')
    }

    function pulang() {
        router.post('/app/absensi/pulang')
    }

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
            <WorkClock />
            <h3 className="text-sm font-semibold text-gray-600 text-center">
                ABSENSI HARI INI
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

                <Info label="Jam Masuk" value={absen?.jam_masuk ?? '-'} />
                <Info label="Jam Pulang" value={absen?.jam_pulang ?? '-'} />

                <Info label="Target Masuk" value="09:00" />
                <Info label="Target Pulang" value="17:00" />

            </div>

            <div className="flex gap-3">

                <Button
                    className="flex-1 bg-[#B50B08] hover:bg-[#9c0906]"
                    disabled={sudahMasuk}
                    onClick={masuk}
                >
                    <LogIn size={16} />
                    Absen Masuk
                </Button>

                <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={!sudahMasuk || sudahPulang}
                    onClick={pulang}
                >
                    <LogOut size={16} />
                    Absen Pulang
                </Button>

            </div>
        </div>
    )
}


function Info({ label, value }: any) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    )
}
