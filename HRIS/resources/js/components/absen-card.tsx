import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'
import WorkClock from './clock'
import AbsensiModal from './absensi-modal'

export default function AbsenCard({ absen }: any) {

    const sudahMasuk = !!absen?.jam_masuk
    const sudahPulang = !!absen?.jam_pulang
    const isAlpha = absen?.status === 'alpha'

    // ⭐ cek jam sekarang
    const now = new Date()
    const isAfterFive = now.getHours() >= 17

    // ⭐ rules baru
    const disableMasuk =
        sudahMasuk ||
        (isAfterFive && !sudahMasuk) ||
        isAlpha

    const disablePulang =
        !sudahMasuk ||
        sudahPulang ||
        isAlpha

    const [openMasuk, setOpenMasuk] = useState(false)
    const [openPulang, setOpenPulang] = useState(false)

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">

            <WorkClock />

            <h3 className="text-sm font-semibold text-gray-600 text-center">
                ABSENSI HARI INI
            </h3>

            {/* STATUS ALPHA */}
            {isAlpha && (
                <div className="bg-red-100 text-red-600 text-center text-sm font-semibold py-2 rounded-lg">
                    ALPHA - Tidak hadir hari ini
                </div>
            )}

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">

                <Info label="Jam Masuk" value={absen?.jam_masuk ?? '-'} />
                <Info label="Jam Pulang" value={absen?.jam_pulang ?? '-'} />

                <Info label="Target Masuk" value="09:00" />
                <Info label="Target Pulang" value="17:00" />

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">

                <Button
                    className="flex-1 bg-[#B50B08] hover:bg-[#9c0906] disabled:bg-gray-300"
                    disabled={disableMasuk}
                    onClick={() => setOpenMasuk(true)}
                >
                    <LogIn size={16} />
                    Absen Masuk
                </Button>

                <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={disablePulang}
                    onClick={() => setOpenPulang(true)}
                >
                    <LogOut size={16} />
                    Absen Pulang
                </Button>

            </div>


            {/* MODALS */}
            <AbsensiModal
                open={openMasuk}
                onClose={() => setOpenMasuk(false)}
                type="masuk"
            />

            <AbsensiModal
                open={openPulang}
                onClose={() => setOpenPulang(false)}
                type="pulang"
            />

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
