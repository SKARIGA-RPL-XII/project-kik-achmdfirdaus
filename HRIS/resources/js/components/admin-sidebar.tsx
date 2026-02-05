import { Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import {
    LayoutGrid,
    Folder,
    Briefcase,
    Building2,
    CalendarDays,
    Users,
    CalendarCheck,
    Plane,
    Clock,
    AlertTriangle,
    Wallet,
    ChevronDown,
    Settings,
    LogOut,
} from 'lucide-react'


/*
|--------------------------------------------------------------------------
| Menu Data
|--------------------------------------------------------------------------
*/

type Item = {
    title: string
    href?: string
    icon: any
    children?: Item[]
}

const menus: Item[] = [
    {
        title: 'Dashboard',
        href: '/app',
        icon: LayoutGrid,
    },
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


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function AdminSidebar() {
    const { url } = usePage()
    const { auth }: any = usePage().props
    const user = auth?.user

    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [openProfile, setOpenProfile] = useState(false)

    const isActive = (href?: string) =>
        href && url.startsWith(href)

    return (
        <aside
            className="
                w-64 h-screen
                flex flex-col
                bg-[#B50B08]
                text-white
                shadow-2xl
            "
        >

            {/* ================= LOGO ================= */}
            <div className="px-6 py-6 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-wide">
                    HRIS
                </h1>
                <p className="text-xs text-white/70">
                    Human Resource
                </p>
            </div>


            {/* ================= MENU ================= */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">

                {menus.map((item) => {

                    const Icon = item.icon

                    /* ---------- WITH CHILDREN ---------- */
                    if (item.children) {
                        const opened = openDropdown === item.title

                        return (
                            <div key={item.title}>
                                <button
                                    onClick={() =>
                                        setOpenDropdown(
                                            opened ? null : item.title
                                        )
                                    }
                                    className="
                                        w-full flex items-center justify-between
                                        px-3 py-2 rounded-lg
                                        hover:bg-white/10
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span>{item.title}</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`${opened ? 'rotate-180' : ''} transition`}
                                    />
                                </button>

                                {opened && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => {
                                            const CIcon = child.icon

                                            return (
                                                <Link
                                                    key={child.title}
                                                    href={child.href!}
                                                    className={`
                                                        flex items-center gap-3
                                                        px-3 py-2 rounded-lg text-sm
                                                        hover:bg-white/10
                                                        ${isActive(child.href) ? 'bg-white/20 font-semibold' : ''}
                                                    `}
                                                >
                                                    <CIcon size={16} />
                                                    {child.title}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    }

                    /* ---------- SINGLE LINK ---------- */
                    return (
                        <Link
                            key={item.title}
                            href={item.href!}
                            className={`
                                flex items-center gap-3
                                px-3 py-2 rounded-lg
                                hover:bg-white/10
                                ${isActive(item.href) ? 'bg-white/20 font-semibold' : ''}
                            `}
                        >
                            <Icon size={18} />
                            {item.title}
                        </Link>
                    )
                })}
            </div>


            {/* ================= PROFILE ================= */}
            <div className="border-t border-white/10 p-3 relative">

                <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="w-full flex items-center gap-3 hover:bg-white/10 rounded-lg p-2"
                >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                    </div>

                    <span className="flex-1 text-sm truncate">
                        {user?.name}
                    </span>
                </button>


                {/* DROPDOWN */}
                {openProfile && (
                    <div className="absolute bottom-14 left-3 right-3 bg-white text-gray-800 rounded-lg shadow-lg">

                        <button
                            onClick={() => router.get('/settings')}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                        >
                            <Settings size={16} />
                            Settings
                        </button>

                        <button
                            onClick={() => router.post('/logout')}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-600"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

        </aside>
    )
}
