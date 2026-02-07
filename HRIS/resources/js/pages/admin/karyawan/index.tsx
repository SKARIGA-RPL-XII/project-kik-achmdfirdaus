import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalKaryawanForm from '@/components/modal-karyawan'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import Alert from '@/components/alert'
import { BreadcrumbItem } from '@/types'
import ActionKaryawanMenu from '@/components/action-menu-karyawan'
import ModalPelanggaran from '@/components/modal-pelanggaran'

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

export default function Index({ karyawan, divisi, jabatan }: any) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Master Data', href: '' },
        { title: 'Karyawan', href: '/app/karyawan' },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<KaryawanData | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [pelanggaranOpen, setPelanggaranOpen] = useState(false)
    const [selectedKaryawan, setSelectedKaryawan] = useState<KaryawanData | null>(null)

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

        if (filterDivisi)
            data = data.filter(i => i.divisi_id === Number(filterDivisi))

        if (filterJabatan)
            data = data.filter(i => i.jabatan_id === Number(filterJabatan))

        return data
    }, [karyawan, filterDivisi, filterJabatan])


    const columns: ColumnDef<KaryawanData>[] = [
        {
            header: 'No',
            render: (_, index) => (
                <span className="text-gray-500">{index + 1}</span>
            ),
        },
        {
            header: 'Nama',
            accessorKey: 'nama',
        },
        {
            header: 'NIP',
            accessorKey: 'nip',
        },
        {
            header: 'JK',
            render: (item) => item.jk === 'L' ? 'Laki-laki' : 'Perempuan',
        },
        {
            header: 'Tanggal Lahir',
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
            className: 'text-center w-14',
            render: (item) => (
                <ActionKaryawanMenu
                    onEdit={() => {
                        setEditData(item)
                        setModalOpen(true)
                    }}
                    onDelete={() => openDelete(item.id)}
                    onReset={() =>
                        router.post(`/app/karyawan/${item.id}/reset-password`)
                    }
                    onPelanggaran={() => {
                        setSelectedKaryawan(item)
                        setPelanggaranOpen(true)
                    }}


                />

            ),
        },
    ]


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Karyawan" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

                <div className="flex justify-between items-center">

                    <div className="flex gap-2">

                        <select
                            value={filterDivisi}
                            onChange={(e) => setFilterDivisi(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">Semua Divisi</option>
                            {divisi.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.nama}</option>
                            ))}
                        </select>

                        <select
                            value={filterJabatan}
                            onChange={(e) => setFilterJabatan(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">Semua Jabatan</option>
                            {jabatan.map((j: any) => (
                                <option key={j.id} value={j.id}>{j.nama}</option>
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


                <div className="bg-white rounded-xl shadow border overflow-hidden">
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
                description="Data tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
            <ModalPelanggaran
                open={pelanggaranOpen}
                onClose={() => {
                    setPelanggaranOpen(false)
                    setSelectedKaryawan(null)
                }}
                karyawan={selectedKaryawan}
            />



        </AppLayout>
    )
}
