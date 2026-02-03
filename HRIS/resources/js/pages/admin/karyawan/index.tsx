import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalKaryawanForm from '@/components/modal-karyawan'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import Alert from '@/components/alert'
import { BreadcrumbItem } from '@/types'

type KaryawanData = {
    id: number
    nama: string
    nip: string
    jk: string
    tanggal_lahir: string
    divisi: string
    jabatan: string
    divisi_id: number
    jabatan_id: number
}

interface PageProps {
    karyawan: KaryawanData[]
    divisi: any[]
    jabatan: any[]
}

export default function Index({ karyawan, divisi, jabatan }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Data Karyawan', href: '/app/karyawan' },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<KaryawanData | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [filterDivisi, setFilterDivisi] = useState('')
    const [filterJabatan, setFilterJabatan] = useState('')

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID')

    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return

        router.delete(`/app/karyawan/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    const filteredData = useMemo(() => {
        let data = [...karyawan]

        if (filterDivisi) {
            data = data.filter((i) => i.divisi_id === Number(filterDivisi))
        }

        if (filterJabatan) {
            data = data.filter((i) => i.jabatan_id === Number(filterJabatan))
        }

        return data
    }, [karyawan, filterDivisi, filterJabatan])

    const columns: ColumnDef<KaryawanData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-24 pl-8 text-center',
            render: (_, index) => (
                <span className="text-gray-500">{index + 1}</span>
            ),
        },
        {
            header: 'Nama',
            accessorKey: 'nama',
            render: (item) => (
                <span className="font-medium text-gray-900">{item.nama}</span>
            ),
        },
        {
            header: 'NIP',
            accessorKey: 'nip',
        },
        {
            header: 'JK',
            accessorKey: 'jk',
            render: (item) => (
                <span>{item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
            ),
        },
        {
            header: 'Tanggal Lahir',
            accessorKey: 'tanggal_lahir',
            render: (item) => formatDate(item.tanggal_lahir),
        },
        {
            header: 'Divisi',
            accessorKey: 'divisi',
        },
        {
            header: 'Jabatan',
            accessorKey: 'jabatan',
        },
        {
            header: '',
            className: 'text-center w-40',
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditData(item)
                            setModalOpen(true)
                        }}
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
                </div>
            ),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Karyawan" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <select
                            value={filterDivisi}
                            onChange={(e) => setFilterDivisi(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm"
                        >
                            <option value="">Semua Divisi</option>
                            {divisi.map((d: any) => (
                                <option key={d.id} value={d.id}>
                                    {d.nama}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterJabatan}
                            onChange={(e) => setFilterJabatan(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm"
                        >
                            <option value="">Semua Jabatan</option>
                            {jabatan.map((j: any) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama}
                                </option>
                            ))}
                        </select>

                        <Button
                            onClick={() => {
                                setEditData(null)
                                setModalOpen(true)
                            }}
                        >
                            Tambah Karyawan
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <DynamicTable
                        title="Daftar Karyawan"
                        data={filteredData}
                        columns={columns}
                        searchKeys={['nama', 'nip']}
                    />
                </div>
            </div>

            <ModalKaryawanForm
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                karyawan={editData}
                divisi={divisi}
                jabatan={jabatan}
            />

            <ModalDelete
                open={deleteOpen}
                title="Hapus Karyawan"
                description="Data karyawan yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
