import { useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
            setViewDate(new Date(initialData.tanggal));
        } else {
            reset();
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

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && handleClose()}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <div className="bg-white w-full max-w-lg rounded p-6">

                <h2 className="text-lg font-bold mb-4">
                    {isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <input
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            placeholder="Keterangan"
                            className="w-full border p-2 rounded"
                        />
                        {(clientErrors.keterangan || errors.keterangan) && (
                            <p className="text-red-500 text-sm">
                                {clientErrors.keterangan || errors.keterangan}
                            </p>
                        )}
                    </div>

                    <div>
                        <select
                            value={data.jenis_hari}
                            onChange={(e) => setData('jenis_hari', e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="event">Event</option>
                            <option value="cuti">Cuti</option>
                        </select>
                        {(clientErrors.jenis_hari || errors.jenis_hari) && (
                            <p className="text-red-500 text-sm">
                                {clientErrors.jenis_hari || errors.jenis_hari}
                            </p>
                        )}
                    </div>

                    <div className="border p-4 rounded">

                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft />
                            </button>

                            <span className="font-semibold text-sm">
                                {monthNames[viewMonth]} {viewYear}
                            </span>

                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {[...Array(firstDay)].map((_, i) => <div key={i} />)}

                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dateStr = formatDate(viewYear, viewMonth, day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setData('tanggal', dateStr)}
                                        className={`p-2 rounded ${data.tanggal === dateStr
                                                ? 'bg-yellow-400 text-white'
                                                : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {(clientErrors.tanggal || errors.tanggal) && (
                            <p className="text-red-500 text-sm mt-2">
                                {clientErrors.tanggal || errors.tanggal}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleClose}>
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
