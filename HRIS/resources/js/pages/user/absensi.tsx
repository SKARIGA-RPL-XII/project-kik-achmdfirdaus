import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React, { useMemo, useState } from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'

export type AbsensiData = {
    id: number
    tanggal: string
    jam_masuk: string
    jam_pulang: string
    status: string
    keterangan: string | null
}

interface PageProps {
    absensiData: AbsensiData[]
}

export default function MyAbsensi({ absensiData }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Absensi Saya', href: '/app/my-absensi' },
    ]

    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    const formatTime = (t?: string | null) =>
        t ? `${t} WIB` : '-'

    const filteredData = useMemo(() => {
        let data = [...absensiData]

        if (statusFilter) {
            data = data.filter((i) => i.status === statusFilter)
        }

        if (from) {
            data = data.filter(
                (i) => new Date(i.tanggal) >= new Date(from)
            )
        }

        if (to) {
            data = data.filter(
                (i) => new Date(i.tanggal) <= new Date(to)
            )
        }

        return data
    }, [absensiData, statusFilter, from, to])


    const columns: ColumnDef<AbsensiData>[] = [
        {
            header: 'No',
            render: (_, index) => index + 1,
        },
        {
            header: 'Tanggal',
            render: (item) => formatDate(item.tanggal),
        },
        {
            header: 'Jam Masuk',
            render: (item) => formatTime(item.jam_masuk) || '-',
        },
        {
            header: 'Jam Pulang',
            render: (item) => formatTime(item.jam_pulang) || '-',
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Keterangan',
            accessorKey: 'keterangan',
        },
    ]
    console.log(absensiData);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Absensi Saya" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                <div className="flex flex-wrap gap-3">

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="hadir">Hadir</option>
                        <option value="izin">Izin</option>
                        <option value="cuti">Cuti</option>
                        <option value="alpha">Alpha</option>
                    </select>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <DynamicTable
                        title="Riwayat Absensi Saya"
                        data={filteredData}
                        columns={columns}
                    />
                </div>
            </div>
        </AppLayout>
    )
}
