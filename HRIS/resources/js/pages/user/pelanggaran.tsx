import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'

export type PelanggaranData = {
    id: number
    tanggal: string
    pelanggaran: string
    status: 'ringan' | 'sedang' | 'berat'
    potongan: number
}

interface PageProps {
    pelanggaranData: PelanggaranData[]
}

export default function MyPelanggaran({ pelanggaranData }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Pelanggaran Saya', href: '/app/my-pelanggaran' },
    ]

    const formatDate = (d: string) =>
        new Date(d + 'T00:00:00').toLocaleDateString('id-ID')

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(n)

    const columns: ColumnDef<PelanggaranData>[] = [

        { header: 'No', render: (_, i) => i + 1 },

        {
            header: 'Tanggal',
            accessorKey: 'tanggal',
            render: (item) => formatDate(item.tanggal)
        },

        {
            header: 'Pelanggaran',
            accessorKey: 'pelanggaran'
        },

        {
            header: 'Level',
            accessorKey: 'status',
            render: (item) => {
                const s = item.status

                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium
                        ${s === 'ringan'
                            ? 'bg-green-100 text-green-700'
                            : s === 'sedang'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                        {s.toUpperCase()}
                    </span>
                )
            }
        },

        {
            header: 'Potongan',
            accessorKey: 'potongan',
            render: (item) => (
                <span className="font-medium text-red-600">
                    {formatRupiah(item.potongan)}
                </span>
            )
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelanggaran Saya" />

            <div className="p-6">

                <DynamicTable
                    title="Riwayat Pelanggaran"
                    data={pelanggaranData}
                    columns={columns}
                />

            </div>
        </AppLayout>
    )
}
