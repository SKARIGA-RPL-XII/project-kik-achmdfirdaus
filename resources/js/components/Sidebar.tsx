import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Link, usePage, } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type AuthUser = {
    id: number;
    name: string;
    role: 'admin' | 'user';
};

type AuthProps = {
    user: AuthUser | null;
};

type PageProps = {
    auth: AuthProps;
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const page = usePage<PageProps>();
    const auth = page.props.auth ?? { user: null };
    const isActive = (path: string) => page.url === path;

    const isAdmin = auth.user?.role === 'admin';
    const sidebarConfig = isAdmin
        ? {
            bg: 'bg-[#0D4838]',
            logo: '/asset/fullputih.png',
            navStyle:
                'w-full justify-start text-white/80 hover:bg-[#0A3D2FB8] hover:text-white transition-colors',
            activeStyle: 'bg-[#0A3D2FB8] text-white',
        }
        : {
            bg: 'bg-[#FFFFFF]',
            logo: '/asset/logo_hijau.png',
            navStyle:
                'w-full justify-start text-[#666666]/80 hover:bg-[#0D48381A] hover:text-[#0D4838] transition-colors',
            activeStyle: 'bg-[#0D48381A] text-[#0D4838]',
        };

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 h-16 ${sidebarConfig.bg} z-50 flex items-center justify-between px-4 md:hidden`}>
                {/* <img
                        src={sidebarConfig.logo}
                        alt="HRIS Logo"
                        className="h-auto w-32 object-contain"
                    /> */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-16 md:top-0 left-0 z-50 flex h-[calc(100vh-4rem)] md:h-screen w-64 flex-col overflow-hidden transition-transform duration-300 ${sidebarConfig.bg} p-4 text-white ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="mb-8 hidden justify-center px-2 md:flex">
                    <img
                        src={sidebarConfig.logo}
                        alt="SmartHRIS Logo"
                        className="h-auto w-full max-w-40 object-contain"
                    />
                </div>

                <div className="flex-1 mt-2 md:mt-0">
                    <nav className="space-y-2 mt-6 px-2">
                        {isAdmin ? (
                            /* ================= MENU ADMIN ================= */
                            <>
                                {/* 1. Dashboard */}
                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/dashboard') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/dashboard" className="flex items-center gap-3">
                                        <Icon icon="material-symbols:dashboard-rounded" width="22" height="22" />
                                        <span>Dashboard</span>
                                    </Link>
                                </Button>

                                {/* 2. Data Karyawan */}
                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/app/karyawan') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/app/karyawan" className="flex items-center gap-3">
                                        <Icon icon="fluent:people-community-20-filled" width="22" height="22" />
                                        <span>Data Karyawan</span>
                                    </Link>
                                </Button>

                                {/* 3. Absensi Karyawan */}
                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/app/absensi') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/app/absensi" className="flex items-center gap-3">
                                        <Icon icon="ic:round-access-time-filled" width="22" height="22" />
                                        <span>Absensi Karyawan</span>
                                    </Link>
                                </Button>

                                {/* 4. Data Cuti Karyawan */}
                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/app/cuti') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/app/cuti" className="flex items-center gap-3">
                                        <Icon icon="bxs:notepad" width="22" height="22" />
                                        <span>Data Cuti Karyawan</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/app/kalender') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/app/kalender" className="flex items-center gap-3">
                                        <Icon icon="solar:calendar-date-bold" width="22" height="22" />
                                        <span>Libur/Cuti Kalender</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/app/pelanggaran') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/app/pelanggaran" className="flex items-center gap-3">
                                        <Icon icon="solar:shield-warning-bold" width="22" height="22" />
                                        <span>Data Sanksi Karyawan</span>
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            /* ================= MENU USER ================= */
                            <>
                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/dashboard') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/dashboard" className="flex items-center gap-3">
                                        <Icon icon="material-symbols:dashboard-rounded" width="22" height="22" />
                                        <span>Dashboard</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/absensi') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/absensi" className="flex items-center gap-3">
                                        {/* Menggunakan solar:user-id-bold (Kartu ID) */}
                                        <Icon icon="solar:user-id-bold" width="22" height="22" />
                                        <span>Absen</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/absensi/riwayat') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/absensi/riwayat" className="flex items-center gap-3">
                                        <Icon icon="fluent:text-bullet-list-square-clock-20-regular" width="22" height="22" />
                                        <span>Riwayat Absen</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/pelanggaran') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/pelanggaran" className="flex items-center gap-3">
                                        <Icon icon="solar:danger-circle-linear" width="22" height="22" />
                                        <span>Pelanggaran</span>
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                    className={`${sidebarConfig.navStyle} ${isActive('/cuti') ? sidebarConfig.activeStyle : ''}`}
                                >
                                    <Link href="/cuti" className="flex items-center gap-3">
                                        <Icon icon="solar:star-fall-linear" width="22" height="22" />
                                        <span>Cuti</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </aside>
        </>
    );
}
