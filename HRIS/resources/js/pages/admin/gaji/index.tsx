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
import { FileDown, Trash2, Calculator } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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
            className: 'text-center w-16',
            render: (i) => (
                <div className="flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PDFDownloadLink
                                document={
                                    <SlipPdf
                                        data={i}
                                        bulan={`${bulanList[i.bulan - 1]} ${i.tahun}`}
                                    />
                                }
                                fileName={`slip-${i.nip}.pdf`}
                                className="inline-flex items-center justify-center w-8 h-8 text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
                            >
                                {({ loading }) => loading ? <span className="text-[10px]">...</span> : <FileDown size={14} />}
                            </PDFDownloadLink>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download Slip Gaji</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ),
        },
        {
            header: '',
            className: 'text-center w-16',
            render: (i) => (
                <div className="flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openDelete(i.id)}
                                className="w-8 h-8 p-0 flex items-center justify-center shadow-sm"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Hapus Data Gaji</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
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
                            className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="">Semua Bulan</option>
                            {bulanList.map((b, i) => (
                                <option key={i} value={i + 1}>{b}</option>
                            ))}
                        </select>

                        <select
                            value={filterTahun}
                            onChange={(e) => setFilterTahun(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="">Semua Tahun</option>
                            {[2024, 2025, 2026].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => router.post('/app/gaji/generate')}
                            className="flex items-center gap-2 shadow-sm"
                        >
                            <Calculator size={16} /> Generate Payroll
                        </Button>

                        <PDFDownloadLink
                            document={
                                <ReportPdf
                                    data={filteredData}
                                    bulan={periodeLabel}
                                />
                            }
                            fileName={`report-${periodeLabel}.pdf`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            {({ loading }) =>
                                loading ? 'Menyiapkan PDF...' : (
                                    <>
                                        <FileDown size={16} /> Export Semua
                                    </>
                                )
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
