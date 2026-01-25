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

const PER_PAGE = 5

export default function Index({ jabatan }: any) {
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [search, setSearch] = useState('')
    const [gajiFilter, setGajiFilter] = useState('')
    const [page, setPage] = useState(1)

    const { flash } = usePage().props as any

    const jabatanFields = [
        { name: 'nama', label: 'Nama Jabatan', required: true },
        { name: 'gaji', label: 'Gaji', type: 'rupiah', required: true },
    ]

    const sourceData = Array.isArray(jabatan)
        ? jabatan
        : Array.isArray(jabatan?.data)
            ? jabatan.data
            : []

    const filteredData = useMemo(() => {
        let data = [...sourceData]

        if (search) {
            data = data.filter((item: any) =>
                item.nama.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (gajiFilter === 'low') {
            data = data.filter((i: any) => i.gaji < 5_000_000)
        }

        if (gajiFilter === 'mid') {
            data = data.filter(
                (i: any) => i.gaji >= 5_000_000 && i.gaji <= 10_000_000
            )
        }

        if (gajiFilter === 'high') {
            data = data.filter((i: any) => i.gaji > 10_000_000)
        }

        return data
    }, [sourceData, search, gajiFilter])

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

        router.delete(`/app/jabatan/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    return (
        <AppLayout>
            <Head title="Jabatan" />

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
                            placeholder="Cari jabatan..."
                        />

                        <select
                            value={gajiFilter}
                            onChange={(e) => {
                                setGajiFilter(e.target.value)
                                setPage(1)
                            }}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Semua Gaji</option>
                            <option value="low">&lt; 5.000.000</option>
                            <option value="mid">
                                5.000.000 – 10.000.000
                            </option>
                            <option value="high">&gt; 10.000.000</option>
                        </select>
                    </div>

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah Jabatan
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
                            label: 'Gaji',
                            render: (row: any) =>
                                formatRupiah(row.gaji),
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
