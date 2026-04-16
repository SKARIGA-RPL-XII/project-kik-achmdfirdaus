import { EventModal } from '@/components/event-modal';
import SuccessModal from '@/components/success-modal';
import ModalDelete from '@/components/modal-delete';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import Holidays from 'date-holidays';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Pencil,
    Trash2,
    CalendarDays,
    Coffee,
    PartyPopper,
    Flag
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { BreadcrumbItem } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface KalenderItem {
    id?: number;
    tanggal: string;
    keterangan?: string;
    jenis_hari: 'libur' | 'cuti' | 'event';
}

interface PageProps {
    kalender: KalenderItem[];
}

const normalizeDate = (date: string | Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
};

export default function Index({ kalender = [] }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Master Data', href: '' },
        {
            title: 'Kalender',
            href: '/app/kalender',
        },
    ]
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [modal, setModal] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { flash } = usePage().props as any;
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (flash?.success) {
            setOpen(true);
        }
    }, [flash]);
    const [selected, setSelected] = useState<KalenderItem | null>(null);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const today = normalizeDate(new Date());

    const liburNasional: KalenderItem[] = useMemo(() => {
        const hd = new Holidays('ID');

        return hd.getHolidays(year).map((h) => ({
            tanggal: normalizeDate(h.date),
            keterangan: h.name,
            jenis_hari: 'libur',
        }));
    }, [year]);

    const allData = [...kalender, ...liburNasional];

    const getEvent = (dateStr: string) =>
        allData.find((e) => normalizeDate(e.tanggal) === dateStr);

    const filterBulanan = (type: string) =>
        allData.filter((e) => {
            const d = new Date(normalizeDate(e.tanggal));
            return (
                e.jenis_hari === type &&
                d.getMonth() === month &&
                d.getFullYear() === year
            );
        });

    const cutiBulanan = filterBulanan('cuti');
    const eventBulanan = filterBulanan('event');
    const liburBulanan = filterBulanan('libur');

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) =>
        setCurrentDate(new Date(year, month + offset, 1));

    const handleEdit = (item: KalenderItem) => {
        setSelected(item);
        setShowEventModal(true);
    };

    function openDelete(id: number) {
        setDeleteId(id);
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!deleteId) return;

        router.delete(`/app/kalender/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false);
                setDeleteId(null);
                setModal(true);
            },
        });
    }

    const renderItem = (item: KalenderItem, showMenu = true, i: number) => {
        const isLibur = item.jenis_hari === 'libur';
        const isCuti = item.jenis_hari === 'cuti';
        const isEvent = item.jenis_hari === 'event';

        return (
            <div key={i} className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-transparent transition-all duration-300 hover:shadow-sm ${isLibur ? 'bg-red-50/60 hover:bg-red-50 hover:border-red-100' : isCuti ? 'bg-amber-50/60 hover:bg-amber-50 hover:border-amber-100' : 'bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-100'}`}>
                <div className="flex gap-3">
                    <div className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isLibur ? 'bg-red-100 text-red-600' : isCuti ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isLibur && <Flag size={14} strokeWidth={2.5}/>}
                        {isCuti && <Coffee size={14} strokeWidth={2.5}/>}
                        {isEvent && <PartyPopper size={14} strokeWidth={2.5}/>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.keterangan || (isCuti ? 'Cuti Bersama' : 'Acara')}</h4>
                        <p className="text-gray-500 text-[11px] font-medium bg-white/60 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>

                {showMenu && (
                    <div className="flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(item)}
                                    className="w-7 h-7 p-0 flex items-center justify-center rounded-lg bg-white shadow-sm border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                >
                                    <Pencil size={12} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Kalender</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => item.id && openDelete(item.id)}
                                    className="w-7 h-7 p-0 flex items-center justify-center rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hapus Kalender</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>
        )
    };

    const bulanNama = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Kalender Akademik & Cuti" />

                <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
                    {/* Hero Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end justify-between relative z-10">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                                Kalender Informasi
                            </h1>
                            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                                <CalendarDays size={16} className="text-gray-400" />
                                Kelola jadwal libur nasional, cuti bersama, dan hari efektif
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setSelected(null);
                                setShowEventModal(true);
                            }}
                            className="bg-[#114F38] hover:bg-[#0d3f2d] text-white shadow-lg shadow-[#114F38]/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 rounded-xl h-11 px-6 font-medium"
                        >
                            <Plus size={18} strokeWidth={2.5}/>
                            <span>Tambah Jadwal</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        {/* Kalender Utama */}
                        <div className="lg:col-span-3 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden relative">
                            {/* Gradient Decoration */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <div className="p-6 sm:p-8 relative z-10">
                                {/* Calendar Header */}
                                <div className="mb-8 flex items-center justify-between bg-gray-50/80 backdrop-blur top-0 py-3 px-5 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 text-[#B50B08]">
                                            <CalendarDays size={22} />
                                        </div>
                                        <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                                            {bulanNama[month]} <span className="font-medium text-gray-400 ml-1">{year}</span>
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => changeMonth(-1)}
                                            className="h-10 w-10 rounded-xl border-gray-200 hover:bg-[#B50B08] hover:text-white hover:border-[#B50B08] transition-all duration-300 shadow-sm"
                                        >
                                            <ChevronLeft size={18} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentDate(new Date())}
                                            className="hidden sm:flex h-10 px-4 rounded-xl border-gray-200 font-medium hover:bg-gray-100 transition-all duration-300 shadow-sm"
                                        >
                                            Hari Ini
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => changeMonth(1)}
                                            className="h-10 w-10 rounded-xl border-gray-200 hover:bg-[#B50B08] hover:text-white hover:border-[#B50B08] transition-all duration-300 shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Calendar Grid Header */}
                                <div className="grid grid-cols-7 mb-4">
                                    {hariNama.map((h, idx) => (
                                        <div 
                                            key={h} 
                                            className={`text-center font-bold text-sm py-2 ${idx === 0 ? 'text-red-500' : 'text-gray-400'}`}
                                        >
                                            {h}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid Days */}
                                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                                    {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="h-16 sm:h-24 opacity-0 pointer-events-none" />)}

                                    {[...Array(daysInMonth)].map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const event = getEvent(dateStr);
                                        const isToday = dateStr === today;
                                        const isSunday = new Date(year, month, day).getDay() === 0;

                                        let baseClass = "relative h-16 sm:h-24 w-full rounded-2xl flex flex-col items-center justify-center sm:items-start sm:justify-start sm:p-2.5 transition-all duration-500 border-2 border-transparent ";
                                        let textClass = `font-bold z-10 relative text-base sm:text-lg mb-0.5 transition-colors ${isSunday ? 'text-red-400' : 'text-gray-700'}`;
                                        let bgClass = "bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer";
                                        let indicator = null;

                                        if (event) {
                                            const isLibur = event.jenis_hari === 'libur';
                                            const isCuti = event.jenis_hari === 'cuti';
                                            
                                            bgClass = isLibur 
                                                ? "bg-red-50 hover:bg-white hover:border-red-300 cursor-pointer shadow-sm hover:shadow-red-500/20 hover:-translate-y-1" 
                                                : isCuti 
                                                    ? "bg-amber-50 hover:bg-white hover:border-amber-300 cursor-pointer shadow-sm hover:shadow-amber-500/20 hover:-translate-y-1" 
                                                    : "bg-emerald-50 hover:bg-white hover:border-emerald-300 cursor-pointer shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-1";
                                                    
                                            textClass = isLibur ? "font-bold text-red-700" : isCuti ? "font-bold text-amber-700" : "font-bold text-emerald-700";
                                            
                                            indicator = (
                                                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 w-full px-1 z-10">
                                                    <div className={`hidden sm:flex items-center gap-1.5 w-full text-[10px] sm:text-xs truncate font-bold rounded-lg px-2 py-1 mt-1 sm:mt-1 border shadow-sm transition-transform ${isLibur ? 'bg-red-100/80 text-red-800 border-red-200/60' : isCuti ? 'bg-amber-100/80 text-amber-800 border-amber-200/60' : 'bg-emerald-100/80 text-emerald-800 border-emerald-200/60'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLibur ? 'bg-red-500' : isCuti ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                        <span className="truncate">{event.keterangan || (isCuti ? 'Cuti' : 'Event')}</span>
                                                    </div>
                                                    <span className={`sm:hidden w-1.5 h-1.5 rounded-full block mx-auto shadow-sm ${isLibur ? 'bg-red-500' : isCuti ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                </div>
                                            );
                                        }

                                        if (isToday) {
                                            bgClass += " ring-[3px] ring-[#B50B08]/40 ring-offset-2";
                                            textClass = textClass.replace('text-gray-700', 'text-[#B50B08]');
                                            if (!event) bgClass += " bg-red-50/40 hover:bg-red-50";
                                        }

                                        const dayCell = (
                                            <div 
                                                key={day} 
                                                onClick={() => {
                                                    if (event && event.id) {
                                                        handleEdit(event);
                                                    } else if (!event || !event.id) {
                                                        if (!event) {
                                                            setSelected({ 
                                                                tanggal: dateStr, 
                                                                jenis_hari: 'event' 
                                                            } as KalenderItem);
                                                            setShowEventModal(true);
                                                        }
                                                    }
                                                }}
                                                className={`group ${baseClass} ${bgClass} overflow-hidden active:scale-95`}
                                            >
                                                {/* Background flair for today */}
                                                {isToday && <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-transparent pointer-events-none" />}
                                                
                                                <span className={textClass}>{day}</span>
                                                {indicator}
                                            </div>
                                        );

                                        if (event) {
                                            return (
                                                <Tooltip delayDuration={200} key={day}>
                                                    <TooltipTrigger asChild>
                                                        {dayCell}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" sideOffset={8} className="bg-white border text-gray-800 shadow-2xl max-w-[240px] text-center rounded-xl p-3 border-gray-100">
                                                        <div className={`w-8 h-8 rounded-full mb-2 mx-auto flex items-center justify-center ${event.jenis_hari === 'libur' ? 'bg-red-100 text-red-600' : event.jenis_hari === 'cuti' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                            {event.jenis_hari === 'libur' && <Flag size={14} />}
                                                            {event.jenis_hari === 'cuti' && <Coffee size={14} />}
                                                            {event.jenis_hari === 'event' && <PartyPopper size={14} />}
                                                        </div>
                                                        <p className="font-bold text-sm text-gray-900 leading-tight">{event.keterangan || event.jenis_hari.toUpperCase()}</p>
                                                        <p className="text-[11px] text-gray-500 mt-1.5 font-medium bg-gray-50 py-1 px-2 rounded-lg">{new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        }

                                        return (
                                            <Tooltip delayDuration={400} key={day}>
                                                <TooltipTrigger asChild>
                                                    {dayCell}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-900 border-gray-800 text-white shadow-xl rounded-lg text-xs font-medium px-3 py-1.5">
                                                    Klik untuk tambah agenda
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Agenda */}
                        <div className="lg:col-span-1 space-y-5">
                            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 sticky top-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
                                    <CalendarDays className="text-[#B50B08]" size={18} />
                                    Agenda Bulan Ini
                                </h3>

                                <div className="space-y-6">
                                    {(liburBulanan.length === 0 && cutiBulanan.length === 0 && eventBulanan.length === 0) ? (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                            <CalendarDays size={32} className="mx-auto text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500 font-medium tracking-tight">Belum ada agenda di bulan ini.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {liburBulanan.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                        <p className="font-bold text-xs uppercase tracking-wider text-gray-500">Libur Nasional</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {liburBulanan.map((l, i) => renderItem(l, false, i))}
                                                    </div>
                                                </div>
                                            )}

                                            {cutiBulanan.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                        <p className="font-bold text-xs uppercase tracking-wider text-gray-500">Cuti Bersama</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {cutiBulanan.map((c, i) => renderItem(c, true, i))}
                                                    </div>
                                                </div>
                                            )}

                                            {eventBulanan.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        <p className="font-bold text-xs uppercase tracking-wider text-gray-500">Event / Kegiatan</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {eventBulanan.map((e, i) => renderItem(e, true, i))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SuccessModal isOpen={open}
                    onClose={() => setOpen(false)}
                    message={flash?.success} />

                <EventModal
                    key={selected?.id ?? selected?.tanggal ?? 'create'}
                    isOpen={showEventModal}
                    initialData={selected as any}
                    success={() => setModal(true)}
                    onClose={() => {
                        setSelected(null);
                        setShowEventModal(false);
                    }}
                />

                <ModalDelete
                    open={deleteOpen}
                    title="Hapus Agenda"
                    description="Agenda kalender yang dihapus tidak dapat dikembalikan."
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                />

            </AppLayout>
        </div>
    );
}

