import { useState, useEffect, useMemo } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import {
    LayoutGrid,
    Folder,
    Briefcase,
    Users,
    CalendarDays,
    Building2,
    Plane,
    Clock,
    AlertTriangle,
    Wallet,
    CalendarCheck,
    ChevronDown,
    Settings,
    LogOut,
} from 'lucide-react'

export default function RoleSidebar() {
    const { props, url } = usePage() as any

    const user = props.auth?.user
    const role = user?.role ?? 'user'

    const [openProfile, setOpenProfile] = useState(false)

    const masterRoutes = [
        '/app/jabatan',
        '/app/divisi',
        '/app/kalender',
        '/app/karyawan',
    ]

    const routeOpen = useMemo(() => {
        return masterRoutes.some(r => url.startsWith(r))
    }, [url])

    const [manualOpen, setManualOpen] = useState<boolean | null>(null)

    useEffect(() => {
        setManualOpen(null)
    }, [url])

    const openMaster = manualOpen ?? routeOpen


    const adminMenus = [
        { title: 'Dashboard', href: '/app', icon: LayoutGrid },
        {
            title: 'Master Data',
            icon: Folder,
            children: [
                { title: 'Jabatan', href: '/app/jabatan', icon: Briefcase },
                { title: 'Divisi', href: '/app/divisi', icon: Building2 },
                { title: 'Kalender', href: '/app/kalender', icon: CalendarDays },
                { title: 'Karyawan', href: '/app/karyawan', icon: Users },
            ],
        },
        { title: 'Absensi', href: '/app/absensi', icon: CalendarCheck },
        { title: 'Cuti', href: '/app/cuti', icon: Plane },
        { title: 'Lembur', href: '/app/lembur', icon: Clock },
        { title: 'Pelanggaran', href: '/app/pelanggaran', icon: AlertTriangle },
        { title: 'Gaji', href: '/app/gaji', icon: Wallet },
    ]

    const userMenus = [
        { title: 'Dashboard', href: '/app', icon: LayoutGrid },
        { title: 'Absensi Saya', href: '/absensi', icon: CalendarCheck },
        { title: 'Cuti Saya', href: '/cuti', icon: Plane },
        { title: 'Lembur Saya', href: '/lembur', icon: Clock },
        { title: 'Pelanggaran Saya', href: '/pelanggaran', icon: AlertTriangle },
        { title: 'Gaji Saya', href: '/gaji', icon: Wallet },
    ]

    const menus = role === 'admin' ? adminMenus : userMenus


    return (
        <aside className="w-64 h-screen shrink-0 flex flex-col bg-[#B50B08] text-white shadow-xl">

            {/* LOGO */}
            <div className="h-20 flex items-center justify-center border-b border-white/10 font-bold text-xl tracking-wide">
                HRIS
            </div>


            {/* MENU */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">

                {menus.map((menu: any, i: number) => {
                    const Icon = menu.icon

                    if (menu.children) {
                        return (
                            <div key={i}>

                                <button
                                    onClick={() => setManualOpen(!openMaster)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        {menu.title}
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${openMaster ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* ANIMATED DROPDOWN */}
                                <div
                                    className={`
                                        overflow-hidden transition-all duration-300 ease-in-out
                                        ${openMaster ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    {menu.children.map((child: any, c: number) => {
                                        const CIcon = child.icon
                                        const active = url.startsWith(child.href)

                                        return (
                                            <Link
                                                key={c}
                                                href={child.href}
                                                className={`
                                                    flex items-center gap-3 px-3 py-2 ml-6 rounded-lg text-sm transition
                                                    ${active ? 'bg-red-900' : 'hover:bg-white/10'}
                                                `}
                                            >
                                                <CIcon size={16} />
                                                {child.title}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }

                    const active =
                        menu.href === '/app'
                            ? url === '/app'
                            : url.startsWith(menu.href)

                    return (
                        <Link
                            key={i}
                            href={menu.href}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg transition
                                ${active ? 'bg-red-900' : 'hover:bg-white/10'}
                            `}
                        >
                            <Icon size={18} />
                            {menu.title}
                        </Link>
                    )
                })}
            </div>


            {/* PROFILE */}
            <div className="border-t border-white/10 p-3 relative">

                <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition"
                >
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown size={16} />
                </button>

                {openProfile && (
                    <div className="absolute bottom-14 left-3 right-3 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <Settings size={14} />
                            Settings
                        </Link>

                        <button
                            onClick={() => router.post('/logout')}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
