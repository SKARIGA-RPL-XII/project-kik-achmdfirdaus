import { EventModal } from '@/components/event-modal';
import SuccessModal from '@/components/success-modal';
import Action from '@/components/action-menu';
import ModalDelete from '@/components/modal-delete';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import Holidays from 'date-holidays';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { BreadcrumbItem } from '@/types'

interface KalenderItem {
    id?: number;
    tanggal: string;
    keterangan?: string;
    jenis_hari: 'libur' | 'cuti' | 'event';
}

interface PageProps {
    kalender: KalenderItem[];
}

const normalizeDate = (date: string | Date) =>
    new Date(date).toISOString().slice(0, 10);

export default function Index({ kalender = [] }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Master Data', href: '' },
        {
            title: 'Kalender',
            href: '/app/jabatan',
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

    const renderItem = (item: KalenderItem, showMenu = true, i: number) => (
        <div key={i} className="flex items-start justify-between gap-2">
            <div>
                {item.keterangan}
                <br />
                <span className="text-gray-400 text-xs">{item.tanggal}</span>
            </div>

            {showMenu && (
                <Action
                    onEdit={() => handleEdit(item)}
                    onDelete={() => item.id && openDelete(item.id)}
                />
            )}
        </div>
    );

    const bulanNama = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const colorMap = {
        libur: 'bg-red-600 text-white',
        cuti: 'bg-yellow-400 text-white',
        event: 'bg-green-600 text-white',
        today: 'border border-blue-600 text-blue-600 font-bold',
        default: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] font-sans">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Libur / Cuti Kalender" />

                <div className="p-8">
                    <h1 className="mb-6 text-xl font-semibold">
                        Libur / Cuti Kalender
                    </h1>

                    <div className="rounded-xl bg-white p-6 shadow">

                        {/* Header */}
                        <div className="mb-6 flex justify-between">
                            <h2 className="font-bold">Kalender</h2>

                            <button
                                onClick={() => {
                                    setSelected(null);
                                    setShowEventModal(true);
                                }}
                                className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white"
                            >
                                <Plus size={18} />
                                Tambah Libur
                            </button>
                        </div>

                        <div className="flex gap-10">

                            {/* Kalender */}
                            <div className="flex-1">

                                <div className="mb-4 flex justify-between">
                                    <span className="font-semibold">
                                        {bulanNama[month]} {year}
                                    </span>

                                    <div className="flex gap-2">
                                        <button onClick={() => changeMonth(-1)}>
                                            <ChevronLeft />
                                        </button>
                                        <button onClick={() => changeMonth(1)}>
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 mb-2 text-xs font-semibold text-gray-400 text-center">
                                    {hariNama.map((h) => (
                                        <div key={h}>{h}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {[...Array(firstDay)].map((_, i) => <div key={i} />)}

                                    {[...Array(daysInMonth)].map((_, i) => {
                                        const day = i + 1;

                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                        const event = getEvent(dateStr);

                                        let color = colorMap.default;
                                        if (event) color = colorMap[event.jenis_hari];
                                        if (dateStr === today) color = colorMap.today;

                                        return (
                                            <button key={day} className={`h-9 rounded ${color}`}>
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="w-56 text-sm space-y-6">
                                <div>
                                    <p className="font-bold text-red-600 mb-2">Libur Nasional</p>
                                    {liburBulanan.map((l, i) => renderItem(l, false, i))}
                                </div>

                                <div>
                                    <p className="font-bold text-yellow-500 mb-2">Cuti</p>
                                    {cutiBulanan.map((c, i) => renderItem(c, true, i))}
                                </div>

                                <div>
                                    <p className="font-bold text-green-600 mb-2">Event</p>
                                    {eventBulanan.map((e, i) => renderItem(e, true, i))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SuccessModal isOpen={open}
                    onClose={() => setOpen(false)}
                    message={flash?.success} />

                <EventModal
                    key={selected?.id ?? 'create'}
                    isOpen={showEventModal}
                    initialData={selected}
                    success={() => setModal(true)}
                    onClose={() => {
                        setSelected(null);
                        setShowEventModal(false);
                    }}
                />

                <ModalDelete
                    open={deleteOpen}
                    title="Hapus Kalender"
                    description="Data kalender yang dihapus tidak dapat dikembalikan."
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                />

            </AppLayout>
        </div>
    );
}
