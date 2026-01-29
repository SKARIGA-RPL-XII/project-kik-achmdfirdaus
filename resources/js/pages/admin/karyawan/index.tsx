import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import Pagination from '@/components/pagination'
import Table from '@/components/table'
import { BreadcrumbItem } from '@/types'
import ModalKaryawanForm from '@/components/modal-karyawan'
import SearchInput from '@/components/search'

const PER_PAGE = 5

export default function Index({ karyawan, divisi, jabatan }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Data Karyawan', href: '/app/karyawan' },
    ]

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [filterDivisi, setFilterDivisi] = useState('')
    const [filterJabatan, setFilterJabatan] = useState('')

    const { flash } = usePage().props as any

    const sourceData = Array.isArray(karyawan)
        ? karyawan
        : Array.isArray(karyawan?.data)
            ? karyawan.data
            : []

    const filteredData = useMemo(() => {
        let data = [...sourceData]

        // Filter by search
        if (search) {
            data = data.filter((item: any) =>
                item.user.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Filter by divisi
        if (filterDivisi) {
            data = data.filter((item: any) => item.divisi_id === Number(filterDivisi))
        }

        // Filter by jabatan
        if (filterJabatan) {
            data = data.filter((item: any) => item.jabatan_id === Number(filterJabatan))
        }

        return data
    }, [sourceData, search, filterDivisi, filterJabatan])

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
        router.delete(`/app/karyawan/${deleteId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteOpen(false)
                setDeleteId(null)
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karyawan" />

            {flash?.success && <p className="text-green-600">{flash.success}</p>}
            {flash?.error && <p className="text-red-600">{flash.error}</p>}

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2 flex-wrap">
                        <SearchInput
                            value={search}
                            onChange={(v) => {
                                setSearch(v)
                                setPage(1)
                            }}
                            placeholder="Cari karyawan..."
                        />

                        <select
                            value={filterDivisi}
                            onChange={(e) => {
                                setFilterDivisi(e.target.value)
                                setPage(1)
                            }}
                            className="border rounded px-3 py-2 text-sm"
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
                            onChange={(e) => {
                                setFilterJabatan(e.target.value)
                                setPage(1)
                            }}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="">Semua Jabatan</option>
                            {jabatan.map((j: any) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        onClick={() => {
                            setEditData(null)
                            setModalOpen(true)
                        }}
                    >
                        Tambah Karyawan
                    </Button>
                </div>

                <Table
                    data={paginatedData}
                    columns={[
                        { label: 'Nama', render: (row: any) => row.user.name },
                        { label: 'Divisi', render: (row: any) => row.divisi?.nama },
                        { label: 'Jabatan', render: (row: any) => row.jabatan?.nama },
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
                                        onClick={() => openDelete(row.id)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />

                <Pagination page={page} totalPage={totalPage} onChange={setPage} />
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
