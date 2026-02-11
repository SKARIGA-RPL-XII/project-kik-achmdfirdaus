import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'
import Alert from '@/components/alert'

export type GajiData = {
    id: number
    bulan: number
    tahun: number
    gaji_pokok: number
    total_lembur: number
    total_potongan: number
    total_gaji: number
}

interface PageProps {
    gajiData: GajiData[]
}

export default function MyGaji({ gajiData }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Gaji Saya', href: '/app/my-gaji' },
    ]
    const { flash } = usePage().props as any
    const rupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(n)

    const bulanNama = [
        '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]

    const columns: ColumnDef<GajiData>[] = [

        { header: 'No', render: (_, i) => i + 1 },

        {
            header: 'Periode',
            render: (item) =>
                `${bulanNama[item.bulan]} ${item.tahun}`
        },

        {
            header: 'Gaji Pokok',
            render: (item) => rupiah(item.gaji_pokok)
        },

        {
            header: 'Lembur (jam)',
            accessorKey: 'total_lembur'
        },

        {
            header: 'Potongan',
            render: (item) =>
                <span className="text-red-600">
                    {rupiah(item.total_potongan)}
                </span>
        },

        {
            header: 'Total Gaji',
            render: (item) =>
                <span className="font-bold text-green-600">
                    {rupiah(item.total_gaji)}
                </span>
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gaji Saya" />
            {flash?.success && <Alert type="success" message={flash.success} />}
            {flash?.error && <Alert type="error" message={flash.error} />}

            <div className="p-6">

                <DynamicTable
                    title="Slip Gaji"
                    data={gajiData}
                    columns={columns}
                />

            </div>
        </AppLayout>
    )
}
