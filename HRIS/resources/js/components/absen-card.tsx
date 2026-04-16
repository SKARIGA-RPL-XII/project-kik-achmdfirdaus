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

    const disableMasuk =
        sudahMasuk ||
        (isAfterFive && !sudahMasuk) ||
        isAlpha

    const disablePulang =
        !sudahMasuk ||
        sudahPulang ||
        isAlpha ||
        !isAfterFive // ⭐ sebelum 17 tidak bisa pulang


    const [openMasuk, setOpenMasuk] = useState(false)
    const [openPulang, setOpenPulang] = useState(false)

    return (
        <div className="group/card bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 hover:shadow-lg hover:border-red-100 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-red-50/70 to-transparent opacity-0 group-hover/card:opacity-100 rounded-bl-[120px] transition-all duration-700 pointer-events-none group-hover/card:scale-125" />
            
            <WorkClock />

            <div className="flex items-center justify-between border-b border-gray-50 pb-3 relative z-10 group-hover/card:border-red-100 transition-colors">
                <h3 className="text-[11px] tracking-wider uppercase font-extrabold text-gray-400 group-hover/card:text-[#B50B08] transition-colors">
                    Terminal Presensi
                </h3>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 group-hover/card:text-[#B50B08] uppercase tracking-widest transition-colors opacity-0 group-hover/card:opacity-100">Live</span>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                </div>
            </div>

            {/* STATUS ALPHA */}
            {isAlpha && (
                <div className="relative z-10 bg-red-50/80 border border-red-100 text-red-600 text-center text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <LogOut size={16} /> ALPHA - Hari Ini Kosong
                </div>
            )}

            {/* INFO */}
            <div className="relative z-10 grid grid-cols-2 gap-3 text-sm">

                <Info label="Jam Masuk" value={absen?.jam_masuk ?? '-'} />
                <Info label="Jam Pulang" value={absen?.jam_pulang ?? '-'} />

                <Info label="Target Masuk" value="09:00" />
                <Info label="Target Pulang" value="17:00" />

            </div>

            {/* BUTTONS */}
            <div className="relative z-10 flex gap-3 mt-auto pt-2">

                <Button
                    className="flex-1 bg-[#B50B08] hover:bg-red-800 disabled:bg-gray-200 disabled:text-gray-400 text-white shadow-sm hover:shadow-md transition-all active:scale-95 duration-300 group/btn1"
                    disabled={disableMasuk}
                    onClick={() => setOpenMasuk(true)}
                >
                    <LogIn size={16} className={`${!disableMasuk && 'group-hover/btn1:scale-125 transition-transform duration-300 mr-1'}`} />
                    Absen Masuk
                </Button>

                <Button
                    variant="secondary"
                    className="flex-1 border hover:bg-gray-100 disabled:opacity-50 transition-all active:scale-95 duration-300 group/btn2"
                    disabled={disablePulang}
                    onClick={() => setOpenPulang(true)}
                >
                    <LogOut size={16} className={`${!disablePulang && 'group-hover/btn2:scale-125 transition-transform duration-300 mr-1'}`} />
                    Absen Pulang
                </Button>

            </div>

            {/* Line accent */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-[#B50B08] to-transparent transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700 ease-in-out origin-center pointer-events-none" />

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
        <div className="bg-gray-50 border border-transparent rounded-xl p-3 text-center transition-all duration-300 hover:bg-red-50/50 hover:border-red-100 hover:shadow-sm cursor-default group/info">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 group-hover/info:text-red-400 transition-colors">{label}</p>
            <p className="font-extrabold text-gray-800 text-base group-hover/info:scale-110 transition-transform duration-300">{value}</p>
        </div>
    )
}
