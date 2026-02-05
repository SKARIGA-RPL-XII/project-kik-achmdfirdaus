import { router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

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

    if (!open) return null

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
        'w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none'

    const readOnlyStyle =
        'bg-gray-100 cursor-not-allowed'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

                {/* ================= HEADER ================= */}
                <div className="mb-6 flex items-center justify-between border-b pb-3">
                    <h2 className="text-lg font-semibold">
                        {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-lg"
                    >
                        ✕
                    </button>
                </div>


                {/* ================= FORM ================= */}
                <form onSubmit={submit} className="space-y-5">

                    {/* NAMA */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nama</label>
                        <input
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={inputStyle}
                            placeholder="Nama lengkap"
                        />
                    </div>


                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputStyle}
                            placeholder="email@company.com"
                        />
                    </div>


                    {/* PERSONAL INFO */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tanggal Lahir</label>
                            <input
                                type="date"
                                readOnly={isEdit}
                                value={data.tanggal_lahir}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                className={`${inputStyle} ${isEdit ? readOnlyStyle : ''}`}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Jenis Kelamin</label>
                            <select
                                value={data.jk}
                                onChange={(e) => setData('jk', e.target.value)}
                                className={inputStyle}
                            >
                                <option value="">Pilih</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                    </div>


                    {/* RELATION INFO */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Jabatan</label>
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

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Divisi</label>
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


                    {/* BUTTON */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Batal
                        </Button>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}
