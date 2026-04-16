import { router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserPlus, UserCog } from 'lucide-react'

type Props = {
    open: boolean
    onClose: () => void
    karyawan?: any
    divisi?: { id: number; nama: string }[]
    jabatan?: { id: number; nama: string }[]
}

export default function ModalKaryawanForm({
    open,
    onClose,
    karyawan,
    divisi = [],
    jabatan = [],
}: Props) {

    const isEdit = Boolean(karyawan)

    const { data, setData, processing } = useForm({
        nama: karyawan?.nama ?? '',
        email: karyawan?.email ?? '',
        nip: karyawan?.nip ?? '',
        jk: karyawan?.jk ?? '',
        tanggal_lahir: karyawan?.tanggal_lahir ?? '',
        divisi_id: karyawan?.divisi_id ?? '',
        jabatan_id: karyawan?.jabatan_id ?? '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()

        if (isEdit) {
            router.put(`/app/karyawan/${karyawan.id}`, data, {
                onSuccess: onClose,
            })
        } else {
            router.post('/app/karyawan', data, {
                onSuccess: onClose,
            })
        }
    }

    const inputStyle =
        'w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 hover:border-gray-300 shadow-sm outline-none'

    const readOnlyStyle =
        'bg-gray-100/50 text-gray-500 cursor-not-allowed hover:border-gray-200 focus:ring-0 focus:border-gray-200'

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-6 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_0_40px_-5px_rgba(0,0,0,0.1)] border-gray-100">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 flex items-center gap-2">
                        {isEdit ? <UserCog className="text-[#dc2626]" size={22} /> : <UserPlus className="text-[#dc2626]" size={22} />}
                        {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">

                        <div className="space-y-1.5 md:col-span-2 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Nama Lengkap</label>
                            <input
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className={inputStyle}
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputStyle}
                                placeholder="email@company.com"
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Tanggal Lahir</label>
                            <input
                                type="date"
                                readOnly={isEdit}
                                value={data.tanggal_lahir}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                className={`${inputStyle} ${isEdit ? readOnlyStyle : ''}`}
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Jenis Kelamin</label>
                            <select
                                value={data.jk}
                                onChange={(e) => setData('jk', e.target.value)}
                                className={inputStyle}
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Jabatan</label>
                            <select
                                value={data.jabatan_id}
                                onChange={(e) => setData('jabatan_id', Number(e.target.value))}
                                className={inputStyle}
                            >
                                <option value="">Pilih Jabatan</option>
                                {jabatan.map(j => (
                                    <option key={j.id} value={j.id}>
                                        {j.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5 group md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-[#dc2626] transition-colors">Divisi</label>
                            <select
                                value={data.divisi_id}
                                onChange={(e) => setData('divisi_id', Number(e.target.value))}
                                className={inputStyle}
                            >
                                <option value="">Pilih Divisi</option>
                                {divisi.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.nama}
                                    </option>
                                ))}
                            </select>
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
                            type="submit" 
                            disabled={processing}
                            className="rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20 transition-all duration-300 active:scale-95 px-6"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}
