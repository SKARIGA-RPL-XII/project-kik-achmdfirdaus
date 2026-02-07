import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalForm from '@/components/modal'
import Alert from '@/components/alert'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { formatRupiah } from '@/lib/format'
import { BreadcrumbItem } from '@/types'

type JabatanData = {
    id: number
    nama: string
    gaji: number
}

interface PageProps {
    jabatan: JabatanData[]
}

export default function Index({ jabatan }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Master Data', href: '' },
        {
            title: 'Jabatan',
            href: '/app/jabatan',
        },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<JabatanData | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [gajiFilter, setGajiFilter] = useState('all')

    const jabatanFields = [
        { name: 'nama', label: 'Nama Jabatan', required: true },
        { name: 'gaji', label: 'Gaji', type: 'rupiah', required: true },
    ]

    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return

        router.delete(`/app/jabatan/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    const filteredData = useMemo(() => {
        if (gajiFilter === 'all') return jabatan

        if (gajiFilter === 'low')
            return jabatan.filter((i) => i.gaji < 5_000_000)

        if (gajiFilter === 'mid')
            return jabatan.filter(
                (i) => i.gaji >= 5_000_000 && i.gaji <= 10_000_000
            )

        if (gajiFilter === 'high')
            return jabatan.filter((i) => i.gaji > 10_000_000)

        return jabatan
    }, [jabatan, gajiFilter])

    const columns: ColumnDef<JabatanData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-24 pl-8 text-center',
            render: (_, index) => (
                <span className="text-gray-500">{index + 1}</span>
            ),
        },
        {
            header: 'Nama Jabatan',
            accessorKey: 'nama',
            render: (item) => (
                <span className="font-medium text-gray-900">{item.nama}</span>
            ),
        },
        {
            header: 'Gaji',
            accessorKey: 'gaji',
            render: (item) => (
                <span className="font-semibold text-emerald-600">
                    {formatRupiah(item.gaji)}
                </span>
            ),
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
            <Head title="Manajemen Jabatan" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <select
                            value={gajiFilter}
                            onChange={(e) => setGajiFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                        >
                            <option value="all">Semua Gaji</option>
                            <option value="low">&lt; 5.000.000</option>
                            <option value="mid">5–10 Juta</option>
                            <option value="high">&gt; 10 Juta</option>
                        </select>

                        <Button
                            onClick={() => {
                                setEditData(null)
                                setModalOpen(true)
                            }}
                        >
                            Tambah Jabatan
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <DynamicTable
                        title="Daftar Jabatan"
                        data={filteredData}
                        columns={columns}
                        searchKeys={['nama']}
                    />
                </div>
            </div>

            <ModalForm
                key={editData ? `edit-${editData.id}` : 'create'}
                open={modalOpen}
                title={editData ? 'Edit Jabatan' : 'Tambah Jabatan'}
                fields={jabatanFields}
                submitUrl={
                    editData
                        ? `/app/jabatan/${editData.id}`
                        : '/app/jabatan'
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
                title="Hapus Jabatan"
                description="Data jabatan yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
