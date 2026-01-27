import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ApprovalActions from '@/components/approval-actions'
import Alert from '@/components/alert'
import SearchInput from '@/components/search'
import Pagination from '@/components/pagination'
import Table from '@/components/table'
import { BreadcrumbItem } from '@/types'

const PER_PAGE = 5

export default function Index({ cuti }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'cuti',
            href: '/app/cuti',
        },
    ];

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [search, setSearch] = useState('')
    const [cutiFilter, setCutiFilter] = useState('')
    const [page, setPage] = useState(1)

    const { flash } = usePage().props as any

    const sourceData = Array.isArray(cuti)
        ? cuti
        : Array.isArray(cuti?.data)
            ? cuti.data
            : []

    const filteredData = useMemo(() => {
        let data = [...sourceData]

        if (search) {
            data = data.filter((item: any) =>
                item.nama.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (cutiFilter === 'pending') {
            data = data.filter((i: any) => i.status == 'pending')
        }

        if (cutiFilter === 'diterima') {
            data = data.filter((i: any) => i.status == 'disetujui')
        }

        if (cutiFilter === 'ditolak') {
            data = data.filter((i: any) => i.status == 'ditolak')
        }

        return data
    }, [sourceData, search, cutiFilter])

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

        router.delete(`/app/cuti/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuti" />

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
                            placeholder="Cari cuti..."
                        />

                        <select
                            value={cutiFilter}
                            onChange={(e) => {
                                setCutiFilter(e.target.value)
                                setPage(1)
                            }}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Semua cuti</option>
                            <option value="pending">Pending</option>
                            <option value="diterima">Diterima</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </div>

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah cuti
                    </Button>
                </div>

                <Table
                    data={paginatedData}
                    columns={[
                        {
                            label: 'Nama',
                            render: (row: any) => row.karyawan_id,
                        },
                        {
                            label: 'Status',
                            render: (row: any) => row.status,
                        },
                        {
                            label: 'Tanggal',
                            render: (row: any) => row.tanggal,
                        },
                        {
                            label: 'Aksi',

                            render: (row: any) => (
                                <ApprovalActions
                                    id={row.id}
                                    status={row.status}
                                    baseUrl="/app/cuti"
                                />
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

            <ModalDelete
                open={deleteOpen}
                title="Hapus cuti"
                description="Data cuti yang dihapus tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
