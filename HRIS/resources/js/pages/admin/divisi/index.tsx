import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalForm from '@/components/modal'
import { formatRupiah } from '@/lib/format'
import Alert from '@/components/alert'
import SearchInput from '@/components/search'
import Pagination from '@/components/pagination'
import Table from '@/components/table'
import { BreadcrumbItem } from '@/types'

const PER_PAGE = 5

export default function Index({ divisi }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisi',
            href: '/app/divisi',
        },
    ];

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    const { flash } = usePage().props as any

    const divisiFields = [
        { name: 'nama', label: 'Nama Dvisi', required: true },
    ]

    const sourceData = Array.isArray(divisi)
        ? divisi
        : Array.isArray(divisi?.data)
            ? divisi.data
            : []

    const filteredData = useMemo(() => {
        let data = [...sourceData]

        if (search) {
            data = data.filter((item: any) =>
                item.nama.toLowerCase().includes(search.toLowerCase())
            )
        }

        return data
    }, [sourceData, search])

    const totalPage = Math.ceil(filteredData.length / PER_PAGE)

    const paginatedData = useMemo(() => {
        const start = (page - 1) * PER_PAGE
        return filteredData.slice(start, start + PER_PAGE)
    }, [filteredData, page])

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisi" />

            {flash?.success && (
                <Alert type="success" message={flash.success} />
            )}
            {flash?.error && (
                <Alert type="error" message={flash.error} />
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <SearchInput
                            value={search}
                            onChange={(v) => {
                                setSearch(v)
                                setPage(1)
                            }}
                            placeholder="Cari Divisi..."
                        />
                    </div>

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah Divisi
                    </Button>
                </div>

                <Table
                    data={paginatedData}
                    columns={[
                        {
                            label: 'Nama',
                            render: (row: any) => row.nama,
                        },
                        {
                            label: 'Aksi',
                            render: (row: any) => (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setEditData(row)
                                            setModalOpen(true)
                                        }}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            openDelete(row.id)
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />

                <Pagination
                    page={page}
                    totalPage={totalPage}
                    onChange={setPage}
                />
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
                description="Data Divisi yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
