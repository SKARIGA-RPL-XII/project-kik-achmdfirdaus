import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalForm from '@/components/modal'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { formatRupiah } from '@/lib/format'
import Alert from '@/components/alert'
import { BreadcrumbItem } from '@/types'

type PelanggaranData = {
    id: number
    nama: string
    nip: string
    tanggal: string
    pelanggaran: string
    status: 'ringan' | 'sedang' | 'berat'
    potongan: number
}

interface PageProps {
    pelanggaranData: PelanggaranData[]
}

export default function Index({ pelanggaranData }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Pelanggaran', href: '/app/pelanggaran' },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const fields = [
        { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { name: 'pelanggaran', label: 'Pelanggaran', required: true },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['ringan', 'sedang', 'berat'],
        },
        { name: 'potongan', label: 'Potongan', type: 'rupiah', required: true },
    ]

    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return
        router.delete(`/app/pelanggaran/${deleteId}`)
    }

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return pelanggaranData
        return pelanggaranData.filter((i) => i.status === statusFilter)
    }, [pelanggaranData, statusFilter])

    const columns: ColumnDef<PelanggaranData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-20 text-center',
            render: (_, index) => index + 1,
        },
        {
            header: 'Karyawan',
            accessorKey: 'nama',
            render: (item) => (
                <div>
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-xs text-gray-500">NIP: {item.nip}</div>
                </div>
            ),
        },
        {
            header: 'Tanggal',
            accessorKey: 'tanggal',
        },
        {
            header: 'Pelanggaran',
            accessorKey: 'pelanggaran',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item) => (
                <span className="capitalize font-medium">{item.status}</span>
            ),
        },
        {
            header: 'Potongan',
            accessorKey: 'potongan',
            render: (item) => formatRupiah(item.potongan),
        },
        {
            header: '',
            render: (item) => (
                <div className="flex gap-2 justify-center">
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
            <Head title="Pelanggaran" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}

                <div className="flex items-center justify-between">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="all">Semua Status</option>
                        <option value="ringan">Ringan</option>
                        <option value="sedang">Sedang</option>
                        <option value="berat">Berat</option>
                    </select>

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah Pelanggaran
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <DynamicTable
                        title="Data Pelanggaran"
                        data={filteredData}
                        columns={columns}
                        searchKeys={['nama', 'nip', 'pelanggaran']}
                    />
                </div>
            </div>

            <ModalForm
                open={modalOpen}
                title={editData ? 'Edit Pelanggaran' : 'Tambah Pelanggaran'}
                fields={fields}
                submitUrl={
                    editData
                        ? `/app/pelanggaran/${editData.id}`
                        : '/app/pelanggaran'
                }
                method={editData ? 'put' : 'post'}
                initialData={editData ?? {}}
                onClose={() => {
                    setModalOpen(false)
                    setEditData(null)
                }}
            />

            <ModalDelete
                open={deleteOpen}
                title="Hapus Pelanggaran"
                description="Data pelanggaran tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
