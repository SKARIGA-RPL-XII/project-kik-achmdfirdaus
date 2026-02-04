import { useEffect, useState } from 'react'

export default function WorkClock() {
    const [time, setTime] = useState('00:00:00')

    useEffect(() => {
        const updateClock = () => {
            const now = new Date()

            const wib = now.toLocaleTimeString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour12: false,
            })

            setTime(wib)
        }

        updateClock()

        const interval = setInterval(updateClock, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">

            <p className="text-sm text-gray-500 mb-2">Waktu Sekarang (WIB)</p>

            <h2 className="text-4xl font-bold tracking-wider text-gray-900 mb-6">
                {time}
            </h2>

            <div className="flex justify-between text-sm text-gray-600">
                <div>
                    <p>Jam Masuk</p>
                    <p className="font-semibold">09:00</p>
                </div>

                <div>
                    <p>Jam Pulang</p>
                    <p className="font-semibold">17:00</p>
                </div>
            </div>
        </div>
    )
}
