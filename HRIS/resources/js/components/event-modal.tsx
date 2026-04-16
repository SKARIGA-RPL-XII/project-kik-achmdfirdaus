import { useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface KalenderItem {
    id?: number;
    tanggal: string;
    keterangan?: string;
    jenis_hari: 'cuti' | 'event';
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    success?: () => void;
    initialData?: KalenderItem | null;
}

export const EventModal = ({
    isOpen,
    onClose,
    success = () => { },
    initialData = null,
}: EventModalProps) => {
    const isEdit = !!initialData;

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        keterangan: '',
        jenis_hari: 'event',
        tanggal: '',
    });

    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (initialData) {
            setData({
                keterangan: initialData.keterangan || '',
                jenis_hari: initialData.jenis_hari,
                tanggal: initialData.tanggal,
            });
            setViewDate(initialData.tanggal ? new Date(initialData.tanggal) : new Date());
        } else {
            reset();
            setViewDate(new Date());
        }

        setClientErrors({});
        clearErrors();
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errs: Record<string, string> = {};

        if (!data.keterangan) errs.keterangan = 'Keterangan wajib diisi';
        if (!data.jenis_hari) errs.jenis_hari = 'Jenis hari wajib dipilih';
        if (!data.tanggal) errs.tanggal = 'Tanggal wajib dipilih';

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleClose = () => {
        reset();
        setClientErrors({});
        setViewDate(new Date());
        onClose();
    };

    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();

    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const changeMonth = (offset: number) =>
        setViewDate(new Date(viewYear, viewMonth + offset, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const options = {
            onSuccess: () => {
                success();
                handleClose();
            },
        };

        isEdit && initialData?.id
            ? put(`/app/kalender/${initialData.id}`, options)
            : post('/app/kalender', options);
    };

    const inputClasses = "w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20 hover:border-gray-300 outline-none";

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-6 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-gray-100">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#dc2626] to-[#f87171] flex items-center gap-2">
                        <CalendarDays className="text-[#dc2626]" size={20} />
                        {isEdit ? 'Edit Agenda Kalender' : 'Tambah Agenda Kalender'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Keterangan <span className="text-red-500">*</span></label>
                        <input
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Contoh: Rapat Paripurna"
                            className={inputClasses}
                        />
                        <div className={`overflow-hidden transition-all duration-300 ${(clientErrors.keterangan || errors.keterangan) ? 'h-5' : 'h-0'}`}>
                            <p className="text-red-500 text-xs font-medium">
                                {clientErrors.keterangan || errors.keterangan}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Jenis Agenda <span className="text-red-500">*</span></label>
                        <select
                            value={data.jenis_hari}
                            onChange={(e) => setData('jenis_hari', e.target.value as any)}
                            className={inputClasses}
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="event">Event / Acara</option>
                            <option value="cuti">Cuti Bersama</option>
                        </select>
                        <div className={`overflow-hidden transition-all duration-300 ${(clientErrors.jenis_hari || errors.jenis_hari) ? 'h-5' : 'h-0'}`}>
                            <p className="text-red-500 text-xs font-medium">
                                {clientErrors.jenis_hari || errors.jenis_hari}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Pilih Tanggal <span className="text-red-500">*</span></label>
                        <div className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm">

                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    size="icon"
                                    onClick={() => changeMonth(-1)}
                                    className="h-8 w-8 rounded-lg hover:bg-[#dc2626] hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </Button>

                                <span className="font-semibold text-sm text-gray-800">
                                    {monthNames[viewMonth]} {viewYear}
                                </span>

                                <Button
                                    variant="outline"
                                    type="button"
                                    size="icon"
                                    onClick={() => changeMonth(1)}
                                    className="h-8 w-8 rounded-lg hover:bg-[#dc2626] hover:text-white transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d, i) => (
                                    <div key={d} className={`text-xs font-bold ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>{d}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {[...Array(firstDay)].map((_, i) => <div key={i} />)}

                                {[...Array(daysInMonth)].map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = formatDate(viewYear, viewMonth, day);
                                    const isSelected = data.tanggal === dateStr;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => setData('tanggal', dateStr)}
                                            className={`h-8 w-full rounded-md text-sm transition-all duration-300 font-medium ${isSelected
                                                    ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/30 scale-110 z-10'
                                                    : 'text-gray-700 hover:bg-red-50 hover:text-[#dc2626]'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${(clientErrors.tanggal || errors.tanggal) ? 'h-5' : 'h-0'}`}>
                            <p className="text-red-500 text-xs font-medium">
                                {clientErrors.tanggal || errors.tanggal}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleClose}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-md shadow-[#dc2626]/20 transition-all duration-300 active:scale-95 px-6"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
};
