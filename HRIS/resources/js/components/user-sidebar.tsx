import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
// import { dashboard } from '@/routes'
import { type NavItem } from '@/types'
import { Link } from '@inertiajs/react'
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
    BookOpen,
    CalendarCheck,
} from 'lucide-react'
import AppLogo from './app-logo'

const mainNavItems: NavItem[] = [
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
    {
        title: 'Absensi',
        href: '/app/absensi',
        icon: CalendarCheck,
    },

    {
        title: 'Cuti',
        href: '/app/cuti',
        icon: Plane,
    },

    {
        title: 'Lembur',
        href: '/app/lembur',
        icon: Clock,
    },

    {
        title: 'Pelanggaran',
        href: '/app/pelanggaran',
        icon: AlertTriangle,
    },

    {
        title: 'Gaji',
        href: '/app/gaji',
        icon: Wallet,
    },
]


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href='/app' prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
