import AppLayout from '@/layouts/app-layout'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ModalDelete from '@/components/modal-delete'
import { formatRupiah } from '@/lib/format'


export default function Index({ jabatan }: any) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)

    const { data, setData, post, put, processing, reset } = useForm({
        nama: '',
        gaji: '',
    })

    function openCreate() {
        reset()
        setEditData(null)
        setOpen(true)
    }

    function openEdit(item: any) {
        setEditData(item)
        setData({
            nama: item.nama,
            gaji: item.gaji,
        })
        setOpen(true)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        if (editData) {
            put(`/app/jabatan/${editData.id}`, {
                onSuccess: () => {
                    setOpen(false)
                    reset()
                },
            })
        } else {
            post('/app/jabatan', {
                onSuccess: () => {
                    setOpen(false)
                    reset()
                },
            })
        }
    }
    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return

        router.delete(`/app/jabatan/${deleteId}`, {
            onSuccess: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }


    return (
        <AppLayout>
            <Head title="Jabatan" />

            <div className="space-y-4">
                <Button onClick={openCreate}>+ Tambah Jabatan</Button>

                <table className="w-full border">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">Nama</th>
                            <th className="p-2 text-left">Gaji</th>
                            <th className="p-2 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jabatan.map((item: any) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.nama}</td>
                                <td className="p-2">{formatRupiah(item.gaji)}</td>
                                <td className="p-2 space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEdit(item)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => openDelete(item.id)}
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editData ? 'Edit Jabatan' : 'Tambah Jabatan'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-3">
                        <Input
                            placeholder="Nama Jabatan"
                            value={data.nama}
                            onChange={(e) =>
                                setData('nama', e.target.value)
                            }
                        />

                        <Input
                            type="number"
                            placeholder="Gaji"
                            value={data.gaji}
                            onChange={(e) =>
                                setData('gaji', e.target.value)
                            }
                        />

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {editData ? 'Update' : 'Simpan'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <ModalDelete
                open={deleteOpen}
                title="Hapus Jabatan"
                description="Data jabatan yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />

        </AppLayout>
    )
}
