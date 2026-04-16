import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from '@inertiajs/react'
import { formatRupiah, parseRupiah } from '@/lib/rupiah'
import { useEffect } from 'react'
import { FileWarning } from 'lucide-react'

type Props = {
    open: boolean
    onClose: () => void
    karyawan?: {
        id: number
        nama: string
        nip: string
    } | null
    pelanggaran?: any
}

export default function ModalPelanggaran({
    open,
    onClose,
    karyawan,
    pelanggaran,
}: Props) {

    const isEdit = Boolean(pelanggaran)

    const { data, setData, post, put, processing, reset } = useForm({
        tanggal: '',
        pelanggaran: '',
        status: 'ringan',
        potongan: '',
    })

    useEffect(() => {
        if (open) {
            setData({
                tanggal: pelanggaran?.tanggal ?? '',
                pelanggaran: pelanggaran?.pelanggaran ?? '',
                status: pelanggaran?.status ?? 'ringan',
                potongan: pelanggaran?.potongan ?? '',
            })
        } else {
            reset()
        }
    }, [open, pelanggaran])

    function submit(e: React.FormEvent) {
        e.preventDefault()

        if (isEdit) {
            put(`/app/pelanggaran/${pelanggaran.id}`, {
                onSuccess: onClose,
            })
        } else {
            post(`/app/karyawan/${karyawan?.id}/pelanggaran`, {
                onSuccess: onClose,
            })
        }
    }

    if (!open) return null

    const inputStyle = 'w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 hover:border-gray-300 shadow-sm outline-none'

    return (
        <Dialog open={open} onOpenChange={(s) => !s && onClose()}>
            <DialogContent className="sm:max-w-[500px] p-6 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border-gray-100">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500 flex items-center gap-2">
                        <FileWarning className="text-red-600" size={22} />
                        {isEdit ? 'Edit Data Pelanggaran' : 'Catat Pelanggaran Baru'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5">

                    {/* PREVIEW KARYAWAN */}
                    <div className="grid grid-cols-2 gap-4 bg-red-50/50 p-4 rounded-xl border border-red-100">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-red-800 uppercase tracking-wider">Karyawan</label>
                            <input
                                value={isEdit ? pelanggaran?.nama : karyawan?.nama}
                                readOnly
                                className="w-full rounded-lg border-red-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-red-800 uppercase tracking-wider">NIP</label>
                            <input
                                value={isEdit ? pelanggaran?.nip : karyawan?.nip}
                                readOnly
                                className="w-full rounded-lg border-red-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 px-1 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">Tanggal Kejadian</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">Keterangan Pelanggaran</label>
                            <textarea
                                value={data.pelanggaran}
                                onChange={(e) => setData('pelanggaran', e.target.value)}
                                placeholder="Jelaskan bentuk pelanggaran secara rinci..."
                                className={`${inputStyle} min-h-[100px] resize-y`}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 group">
                                <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">Tingkat / Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={inputStyle}
                                >
                                    <option value="ringan">Ringan</option>
                                    <option value="sedang">Sedang</option>
                                    <option value="berat">Berat</option>
                                </select>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">Potongan Gaji</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                                    <input
                                        type="text"
                                        value={formatRupiah(data.potongan)}
                                        onChange={(e) =>
                                            setData('potongan', parseRupiah(e.target.value))
                                        }
                                        placeholder="0"
                                        className={`${inputStyle} pl-10`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            Batal
                        </Button>
                        <Button 
                            disabled={processing}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all duration-300 active:scale-95 px-6"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

