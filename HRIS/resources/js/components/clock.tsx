import { useEffect, useState } from 'react'
import { Clock as ClockIcon, MapPin } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function WorkClock({ compact = false }: any) {
    const [hours, setHours] = useState('00')
    const [minutes, setMinutes] = useState('00')
    const [seconds, setSeconds] = useState('00')
    const [date, setDate] = useState('')

    useEffect(() => {
        const update = () => {
            const now = new Date()

            const wib = new Date(
                now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
            )

            setHours(String(wib.getHours()).padStart(2, '0'))
            setMinutes(String(wib.getMinutes()).padStart(2, '0'))
            setSeconds(String(wib.getSeconds()).padStart(2, '0'))

            setDate(
                wib.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })
            )
        }

        update()
        const i = setInterval(update, 1000)
        return () => clearInterval(i)
    }, [])

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col h-full justify-center items-center text-center hover:shadow-md hover:border-red-100 transition-all duration-500 overflow-hidden relative cursor-default transform hover:-translate-y-1">
                        
                        {/* Latar Belakang Subtle Pulse */}
                        <div className="absolute inset-0 bg-red-50/0 group-hover:bg-red-50/40 transition-colors duration-500 pointer-events-none" />
                        
                        {/* Watermark Ornamen */}
                        <div className="absolute -left-10 -top-10 text-red-50 opacity-40 transform -rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-125">
                            <ClockIcon size={120} strokeWidth={1} />
                        </div>

                        {/* Ikon Jam Bouncing */}
                        <div className="relative z-10 mb-6 flex items-center justify-center">
                            {/* Riak Gelombang (Ripple) di Belakang */}
                            <div className="absolute inset-0 bg-[#B50B08]/10 rounded-full scale-100 group-hover:scale-[1.8] group-hover:opacity-0 transition-all duration-700 ease-out" />
                            
                            {/* Ikon Utama */}
                            <div className="relative bg-white border-2 border-gray-50 text-[#B50B08] p-3 rounded-full flex items-center justify-center group-hover:bg-[#B50B08] group-hover:border-[#B50B08] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_0_15px_rgba(181,11,8,0.4)]">
                                <ClockIcon size={24} className="transition-transform duration-500 group-hover:-rotate-12" />
                            </div>
                        </div>

                        {/* Digital Timer */}
                        <h2 className="relative z-10 flex items-baseline gap-1.5 text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight mb-3 tabular-nums">
                            <span>{hours}</span>
                            <span className="text-red-500/80 animate-pulse">:</span>
                            <span>{minutes}</span>
                            <span className="text-xl lg:text-2xl text-gray-400 font-bold ml-0.5">.{seconds}</span>
                        </h2>

                        {/* Tanggal & Hari */}
                        <p className="relative z-10 flex items-center gap-1.5 text-[10px] lg:text-[11px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                            <MapPin size={12} className="text-[#B50B08] group-hover:animate-bounce" />
                            {date}
                        </p>

                        {/* Bottom line accent */}
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-red-600 via-[#B50B08] to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />

                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 border-none text-white text-xs px-3 py-1.5 shadow-xl font-medium rounded-lg">
                    Zona Waktu: Waktu Indonesia Barat (WIB)
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
