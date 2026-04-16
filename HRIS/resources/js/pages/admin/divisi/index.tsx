import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalForm from '@/components/modal'
import Alert from '@/components/alert'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'
import { Pencil, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type DivisiData = {
    id: number
    nama: string
}

interface PageProps {
    divisi: DivisiData[]
}

export default function Index({ divisi }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Master Data', href: '' },
        {
            title: 'Divisi',
            href: '/app/divisi',
        },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<DivisiData | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const divisiFields = [
        { name: 'nama', label: 'Nama Divisi', required: true },
    ]

    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return

        router.delete(`/app/divisi/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    const columns: ColumnDef<DivisiData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-24 pl-8 text-center',
            render: (_, index) => (
                <span className="text-gray-500">{index + 1}</span>
            ),
        },
        {
            header: 'Nama Divisi',
            accessorKey: 'nama',
            render: (item) => (
                <span className="font-medium text-gray-900">{item.nama}</span>
            ),
        },
        {
            header: '',
            className: 'text-center w-24',
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditData(item)
                                    setModalOpen(true)
                                }}
                                className="w-8 h-8 p-0 flex items-center justify-center shadow-sm"
                            >
                                <Pencil size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Divisi</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openDelete(item.id)}
                                className="w-8 h-8 p-0 flex items-center justify-center shadow-sm"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Hapus Divisi</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Divisi" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex items-center justify-between">

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah Divisi
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <DynamicTable
                        title="Daftar Divisi"
                        data={divisi}
                        columns={columns}
                        searchKeys={['nama']}
                    />
                </div>
            </div>

            <ModalForm
                key={editData ? `edit-${editData.id}` : 'create'}
                open={modalOpen}
                title={editData ? 'Edit Divisi' : 'Tambah Divisi'}
                fields={divisiFields}
                submitUrl={
                    editData
                        ? `/app/divisi/${editData.id}`
                        : '/app/divisi'
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
                title="Hapus Divisi"
                description="Data divisi yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
