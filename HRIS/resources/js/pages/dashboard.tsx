import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import AdminDashboard from '@/components/dashboard/admin'
import UserDashboard from '@/components/dashboard/user'
import { Sparkles, CalendarDays } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'App', href: '/app' },
]

export default function Dashboard(props: any) {

    const { auth }: any = usePage().props
    const role = auth?.user?.role ?? 'user'
    const name = auth?.user?.name ?? 'Pengguna'

    const dateStr = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })

    const hour = new Date().getHours()
    let greeting = 'Selamat Pagi'
    if (hour >= 11 && hour < 15) greeting = 'Selamat Siang'
    else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore'
    else if (hour >= 18) greeting = 'Selamat Malam'

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50B08] rounded-l-2xl group-hover:w-2 transition-all duration-300" />

                    <div className="absolute -right-20 -bottom-20 text-red-50 opacity-40 pointer-events-none transform -rotate-12 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles size={250} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 pl-2 text-center md:text-left">
                        <div className="inline-flex items-center justify-center md:justify-start gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#B50B08] mb-4 border border-red-100">
                            <Sparkles size={12} strokeWidth={2.5} />
                            <span className="text-[10px] font-bold tracking-wider uppercase">{greeting}</span>
                        </div>
                        
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B50B08] to-red-400">{name}</span>!
                        </h1>
                        
                        <p className="text-gray-500 text-xs md:text-sm max-w-lg md:max-w-xl leading-relaxed mx-auto md:mx-0">
                            {role === 'admin' 
                                ? 'Ringkasan presensi dan data absensi perusahaan Anda. Kelola aktivitas HRD lebih mudah dan terpusat.' 
                                : 'Selamat beraktivitas! Pastikan Anda melakukan absensi tepat waktu setiap jadwal kerja Anda.'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-2 md:mt-0 flex-shrink-0 w-full md:w-auto">
                        <div className="flex items-center justify-center md:justify-start gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100 group-hover:border-red-100 group-hover:bg-red-50/30 transition-colors duration-500">
                            <div className="p-3 bg-white rounded-lg text-[#B50B08] shadow-sm border border-gray-100">
                                <CalendarDays size={22} className="animate-pulse" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 whitespace-nowrap">Tanggal Hari Ini</p>
                                <p className="text-sm font-bold text-gray-700 whitespace-nowrap">{dateStr}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-20">
                    {
                        role === 'admin'
                            ? <AdminDashboard {...props} />
                            : <UserDashboard {...props} />
                    }
                </div>
            </div>

        </AppLayout>
    )
}
