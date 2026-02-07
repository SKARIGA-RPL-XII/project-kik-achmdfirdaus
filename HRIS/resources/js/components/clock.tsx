import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export default function WorkClock({ compact = false }: any) {
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
        const update = () => {
            const now = new Date()

            const wib = new Date(
                now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
            )

            const h = String(wib.getHours()).padStart(2, '0')
            const m = String(wib.getMinutes()).padStart(2, '0')
            const s = String(wib.getSeconds()).padStart(2, '0')

            setTime(`${h}:${m}:${s}`)

            setDate(
                wib.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })
            )
        }

        update()
        const i = setInterval(update, 1000)
        return () => clearInterval(i)
    }, [])

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 text-center space-y-3">
            <Clock className="mx-auto text-[#B50B08]" size={30} />

            <p className="text-xs tracking-widest text-gray-400">
                WAKTU SEKARANG (WIB)
            </p>

            <h2 className="text-4xl font-bold text-[#B50B08] tracking-widest">
                {time}
            </h2>

            <p className="text-sm text-gray-500 capitalize">
                {date}
            </p>
        </div>
    )
}
