import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React, { useMemo, useState } from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import SearchInput from '@/components/search'
import { BreadcrumbItem } from '@/types'

export type AbsensiData = {
    id: number
    nama: string
    nip: string
    jabatan: string
    departemen: string
    tanggal: string
    jam_masuk: string
    jam_pulang: string
    status: string
    keterangan: string | null
}

interface PageProps {
    absensiData: AbsensiData[]
}

export default function AbsensiIndex({ absensiData }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'App',
            href: '/app',
        },
        {
            title: 'Riwayat Absensi',
            href: '/app/absensi',
        },
    ]

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('id-ID')

    const filteredData = useMemo(() => {
        let data = [...absensiData]

        if (search) {
            data = data.filter(
                (i) =>
                    i.nama.toLowerCase().includes(search.toLowerCase()) ||
                    i.nip.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (statusFilter) {
            data = data.filter((i) => i.status === statusFilter)
        }

        if (from) {
            data = data.filter((i) => new Date(i.tanggal) >= new Date(from))
        }

        if (to) {
            data = data.filter((i) => new Date(i.tanggal) <= new Date(to))
        }

        return data
    }, [absensiData, search, statusFilter, from, to])

    const columns: ColumnDef<AbsensiData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            className: 'w-20 text-center',
            render: (_, index) => index + 1,
        },
        {
            header: 'Karyawan',
            accessorKey: 'nama',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium">{item.nama}</span>
                    <span className="text-xs text-gray-500">
                        NIP: {item.nip}
                    </span>
                </div>
            ),
        },
        {
            header: 'Jabatan',
            accessorKey: 'jabatan',
        },
        {
            header: 'Departemen',
            accessorKey: 'departemen',
        },
        {
            header: 'Tanggal',
            accessorKey: 'tanggal',
            render: (item) => formatDate(item.tanggal),
        },
        {
            header: 'Jam Kerja',
            render: (item) => (
                <span>
                    {item.jam_masuk} - {item.jam_pulang}
                </span>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item) => {
                const color =
                    item.status === 'hadir'
                        ? 'bg-emerald-100 text-emerald-600'
                        : item.status === 'izin'
                            ? 'bg-blue-100 text-blue-600'
                            : item.status === 'cuti'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-600'

                return (
                    <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${color}`}
                    >
                        {item.status}
                    </span>
                )
            },
        },
        {
            header: 'Keterangan',
            accessorKey: 'keterangan',
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                <div className="flex flex-wrap gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
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
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <DynamicTable
                        title="Data Absensi"
                        data={filteredData}
                        columns={columns}
                        searchKeys={['nama', 'nip']}
                    />
                </div>
            </div>
        </AppLayout>
    )
}
