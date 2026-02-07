import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from '@inertiajs/react'
import { formatRupiah, parseRupiah } from '@/lib/rupiah'
import { useEffect, useState } from 'react'

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

    const { data, setData, post, put, processing, errors, reset } = useForm({
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


    return (
        <Dialog open={open} onOpenChange={(s) => !s && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Pelanggaran' : 'Tambah Pelanggaran'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">

                    {/* PREVIEW */}
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            value={isEdit ? pelanggaran.nama : karyawan?.nama}
                            readOnly
                            className="rounded border bg-gray-100 px-3 py-2 text-sm"
                        />

                        <input
                            value={isEdit ? pelanggaran.nip : karyawan?.nip}
                            readOnly
                            className="rounded border bg-gray-100 px-3 py-2 text-sm"
                        />
                    </div>


                    <input
                        type="date"
                        value={data.tanggal}
                        onChange={(e) => setData('tanggal', e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <textarea
                        value={data.pelanggaran}
                        onChange={(e) =>
                            setData('pelanggaran', e.target.value)
                        }
                        className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm"
                    >
                        <option value="ringan">Ringan</option>
                        <option value="sedang">Sedang</option>
                        <option value="berat">Berat</option>
                    </select>

                    <input
                        type="text"
                        value={formatRupiah(data.potongan)}
                        onChange={(e) =>
                            setData('potongan', parseRupiah(e.target.value))
                        }
                        className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={onClose}>
                            Batal
                        </Button>
                        <Button disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

