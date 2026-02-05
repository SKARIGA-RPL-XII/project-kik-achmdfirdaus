import { useEffect, useState } from 'react'

export default function WorkClock({ compact = false }: any) {
    const [time, setTime] = useState('')

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
        }

        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [])

    if (compact) {
        return (
            <div className="text-center">
                <p className="text-xs text-gray-400">Waktu (WIB)</p>
                <p className="text-2xl font-bold">{time}</p>

                <div className="flex justify-center gap-6 text-xs text-gray-500 mt-2">
                    <span>Masuk 09:00</span>
                    <span>Pulang 17:00</span>
                </div>
            </div>
        )
    }

    return null
}
