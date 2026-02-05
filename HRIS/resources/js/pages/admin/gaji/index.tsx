import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import ModalForm from '@/components/modal'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import Alert from '@/components/alert'
import { formatRupiah } from '@/lib/format'
import { BreadcrumbItem } from '@/types'

type GajiData = {
    id: number
    nama: string
    nip: string
    bulan: number
    tahun: number
    gaji_pokok: number
    total_lembur: number
    total_potongan: number
    total_gaji: number
    karyawan_id: number
}

interface PageProps {
    gajiData: GajiData[]
    karyawanList: any[]
}

export default function Index({ gajiData, karyawanList }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Gaji', href: '/app/gaji' },
    ]

    const { flash } = usePage().props as any

    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState<any>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [filterBulan, setFilterBulan] = useState('')
    const [filterTahun, setFilterTahun] = useState('')

    const bulanList = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]

    function openDelete(id: number) {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    function handleDelete() {
        if (!deleteId) return
        router.delete(`/app/gaji/${deleteId}`)
    }

    const filteredData = useMemo(() => {
        let data = [...gajiData]

        if (filterBulan) {
            data = data.filter(i => i.bulan === Number(filterBulan))
        }

        if (filterTahun) {
            data = data.filter(i => i.tahun === Number(filterTahun))
        }

        return data
    }, [gajiData, filterBulan, filterTahun])

    const fields = [
        {
            name: 'karyawan_id',
            label: 'Karyawan',
            type: 'select',
            options: karyawanList.map(k => ({
                value: k.id,
                label: k.nama
            }))
        },
        { name: 'bulan', label: 'Bulan', type: 'number' },
        { name: 'tahun', label: 'Tahun', type: 'number' },
        { name: 'gaji_pokok', label: 'Gaji Pokok', type: 'rupiah' },
        { name: 'total_lembur', label: 'Total Lembur', type: 'rupiah' },
        { name: 'total_potongan', label: 'Total Potongan', type: 'rupiah' },
        { name: 'total_gaji', label: 'Total Gaji', type: 'rupiah' },
    ]

    const columns: ColumnDef<GajiData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-20 text-center',
            render: (_, index) => index + 1,
        },
        {
            header: 'Karyawan',
            accessorKey: 'nama',
            render: (i) => (
                <div>
                    <div className="font-medium">{i.nama}</div>
                    <div className="text-xs text-gray-500">NIP: {i.nip}</div>
                </div>
            ),
        },
        {
            header: 'Periode',
            render: (i) => `${bulanList[i.bulan - 1]} ${i.tahun}`,
        },
        {
            header: 'Pokok',
            render: (i) => formatRupiah(i.gaji_pokok),
        },
        {
            header: 'Lembur',
            render: (i) => formatRupiah(i.total_lembur),
        },
        {
            header: 'Potongan',
            render: (i) => formatRupiah(i.total_potongan),
        },
        {
            header: 'Total',
            render: (i) => (
                <span className="font-bold text-emerald-600">
                    {formatRupiah(i.total_gaji)}
                </span>
            ),
        },
        {
            header: '',
            render: (i) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditData(i)
                            setModalOpen(true)
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDelete(i.id)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}

                <div className="flex items-center justify-between">

                    <div className="flex gap-2">
                        <select
                            value={filterBulan}
                            onChange={(e) => setFilterBulan(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">Semua Bulan</option>
                            {bulanList.map((b, i) => (
                                <option key={i} value={i + 1}>{b}</option>
                            ))}
                        </select>

                        <select
                            value={filterTahun}
                            onChange={(e) => setFilterTahun(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">Semua Tahun</option>
                            {[2024, 2025, 2026].map(t => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={() => router.post('/app/gaji/generate')}>
                        Generate Payroll
                    </Button>

                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <DynamicTable
                        title="Data Gaji Karyawan"
                        data={filteredData}
                        columns={columns}
                        searchKeys={['nama', 'nip']}
                    />
                </div>
            </div>

            <ModalForm
                open={modalOpen}
                title={editData ? 'Edit Gaji' : 'Tambah Gaji'}
                fields={fields}
                submitUrl={
                    editData
                        ? `/app/gaji/${editData.id}`
                        : '/app/gaji'
                }
                method={editData ? 'put' : 'post'}
                initialData={editData ?? {}}
                onClose={() => setModalOpen(false)}
            />

            <ModalDelete
                open={deleteOpen}
                title="Hapus Gaji"
                description="Data gaji tidak dapat dikembalikan."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    )
}
