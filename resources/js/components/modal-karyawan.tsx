import { useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

type Props = {
    open: boolean
    onClose: () => void
    karyawan?: any
    divisi?: { id: number; nama: string }[]
    jabatan?: { id: number; nama: string }[]
}

export default function ModalKaryawanForm({ open, onClose, karyawan, divisi = [], jabatan = [] }: Props) {
    const isEdit = Boolean(karyawan)

    const { data, setData, processing, errors } = useForm({
        nama: karyawan?.user?.name ?? '',
        divisi_id: karyawan?.divisi_id ?? '',
        jabatan_id: karyawan?.jabatan_id ?? '',
    })

    useEffect(() => {
        if (open) {
            setData({
                nama: karyawan?.user?.name ?? '',
                divisi_id: karyawan?.divisi_id ?? '',
                jabatan_id: karyawan?.jabatan_id ?? '',
            })
        }
    }, [open, karyawan])

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (isEdit) {
            router.put(`/app/karyawan/${karyawan.id}`, data, { onSuccess: onClose })
        } else {
            router.post('/app/karyawan', data, { onSuccess: onClose })
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Karyawan */}
                    <div>
                        <label className="block text-sm font-medium">Nama Karyawan</label>
                        {isEdit ? (
                            <input
                                type="text"
                                value={data.nama}
                                readOnly
                                className="w-full rounded border bg-gray-100 px-3 py-2 text-sm cursor-not-allowed"
                            />
                        ) : (
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Masukkan nama karyawan"
                                className="w-full rounded border px-3 py-2 text-sm"
                            />
                        )}
                        {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                    </div>

                    {/* Jabatan */}
                    <div>
                        <label className="block text-sm font-medium">Jabatan</label>
                        <select
                            value={data.jabatan_id}
                            onChange={(e) => setData('jabatan_id', Number(e.target.value))}
                            className="w-full rounded border px-3 py-2 text-sm"
                        >
                            <option value="">Pilih Jabatan</option>
                            {Array.isArray(jabatan) && jabatan.length > 0 ? (
                                jabatan.map(j => (
                                    <option key={j.id} value={j.id}>{j.nama}</option>
                                ))
                            ) : (
                                <option disabled>Tidak ada data</option>
                            )}
                        </select>
                        {errors.jabatan_id && <p className="text-sm text-red-500">{errors.jabatan_id}</p>}
                    </div>

                    {/* Divisi */}
                    <div>
                        <label className="block text-sm font-medium">Divisi</label>
                        <select
                            value={data.divisi_id}
                            onChange={(e) => setData('divisi_id', Number(e.target.value))}
                            className="w-full rounded border px-3 py-2 text-sm"
                        >
                            <option value="">Pilih Divisi</option>
                            {Array.isArray(divisi) && divisi.length > 0 ? (
                                divisi.map(d => (
                                    <option key={d.id} value={d.id}>{d.nama}</option>
                                ))
                            ) : (
                                <option disabled>Tidak ada data</option>
                            )}
                        </select>
                        {errors.divisi_id && <p className="text-sm text-red-500">{errors.divisi_id}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
