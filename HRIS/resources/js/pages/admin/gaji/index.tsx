import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModalDelete from '@/components/modal-delete'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import Alert from '@/components/alert'
import { formatRupiah } from '@/lib/format'
import { BreadcrumbItem } from '@/types'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ReportPdf from '@/components/report'
import SlipPdf from '@/components/slip-report'

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
}

export default function Index({ gajiData }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Gaji', href: '/app/gaji' },
    ]

    const { flash } = usePage().props as any

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [filterBulan, setFilterBulan] = useState('')
    const [filterTahun, setFilterTahun] = useState('')

    const bulanList = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]

    // Default bulan kemarin
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)

    const defaultBulan = lastMonth.getMonth() + 1
    const defaultTahun = lastMonth.getFullYear()

    const activeBulan = filterBulan ? Number(filterBulan) : defaultBulan
    const activeTahun = filterTahun ? Number(filterTahun) : defaultTahun

    const periodeLabel = `${bulanList[activeBulan - 1]} ${activeTahun}`

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

    const columns: ColumnDef<GajiData>[] = [
        {
            header: 'No',
            render: (_, index) => index + 1,
        },
        {
            header: 'Karyawan',
            render: (i) => (
                <div>
                    <div className="font-medium">{i.nama}</div>
                    <div className="text-xs text-gray-500">
                        NIP: {i.nip}
                    </div>
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
            header: 'Slip',
            render: (i) => (
                <PDFDownloadLink
                    document={
                        <SlipPdf
                            data={i}
                            bulan={`${bulanList[i.bulan - 1]} ${i.tahun}`}
                        />
                    }
                    fileName={`slip-${i.nip}.pdf`}
                    className="text-blue-600 underline"
                >
                    {({ loading }) => loading ? '...' : 'Download'}
                </PDFDownloadLink>
            ),
        },
        {
            header: '',
            render: (i) => (
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDelete(i.id)}
                >
                    Hapus
                </Button>
            ),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {flash?.success && <Alert type="success" message={flash.success} />}
                {flash?.error && <Alert type="error" message={flash.error} />}

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
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => router.post('/app/gaji/generate')}>
                            Generate Payroll
                        </Button>

                        <PDFDownloadLink
                            document={
                                <ReportPdf
                                    data={filteredData}
                                    bulan={periodeLabel}
                                />
                            }
                            fileName={`report-${periodeLabel}.pdf`}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            {({ loading }) =>
                                loading ? 'Generating PDF...' : 'Export Semua'
                            }
                        </PDFDownloadLink>
                    </div>
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
