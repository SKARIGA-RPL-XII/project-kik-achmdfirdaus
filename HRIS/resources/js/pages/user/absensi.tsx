import { router, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { BreadcrumbItem } from '@/types'

export default function AbsensiUser({ absen }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'App',
            href: '/app',
        },
        {
            title: 'Absensi',
            href: '/app/absensi',
        },
    ]

    const { flash }: any = usePage().props

    const [time, setTime] = useState('')

    useEffect(() => {
        const updateClock = () => {
            const now = new Date().toLocaleTimeString('id-ID', {
                hour12: false,
                timeZone: 'Asia/Jakarta',
            })
            setTime(now)
        }

        updateClock()
        const i = setInterval(updateClock, 1000)
        return () => clearInterval(i)
    }, [])


    const sudahMasuk = !!absen?.jam_masuk
    const sudahPulang = !!absen?.jam_pulang


    function checkin() {
        router.post('/app/absensi/checkin')
    }

    function checkout() {
        router.post('/app/absensi/checkout')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Absensi" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

                <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 text-center space-y-6">

                    <Clock className="mx-auto text-red-600" size={40} />

                    <h2 className="text-4xl font-bold tracking-widest">
                        {time}
                    </h2>

                    <p className="text-gray-500 text-sm">
                        {new Date().toLocaleDateString('id-ID')}
                    </p>


                    {/* STATUS */}
                    <div className="space-y-1 text-sm">
                        <p>
                            Masuk :
                            <span className="font-semibold ml-2">
                                {absen?.jam_masuk ?? '-'}
                            </span>
                        </p>

                        <p>
                            Pulang :
                            <span className="font-semibold ml-2">
                                {absen?.jam_pulang ?? '-'}
                            </span>
                        </p>
                    </div>


                    {/* BUTTON */}
                    <div className="flex gap-3 pt-4">

                        <Button
                            className="flex-1"
                            disabled={sudahMasuk}
                            onClick={checkin}
                        >
                            Absen Masuk
                        </Button>

                        <Button
                            variant="secondary"
                            className="flex-1"
                            disabled={!sudahMasuk || sudahPulang}
                            onClick={checkout}
                        >
                            Absen Pulang
                        </Button>

                    </div>


                    {flash?.success && (
                        <p className="text-green-600 text-sm">{flash.success}</p>
                    )}

                    {flash?.error && (
                        <p className="text-red-600 text-sm">{flash.error}</p>
                    )}

                </div>
            </div>

        </AppLayout>
    )
}
