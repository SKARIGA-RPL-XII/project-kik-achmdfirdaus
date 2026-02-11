import { Head, router, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Check, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'
import Alert from '@/components/alert'

export type LemburData = {
    id: number
    nama: string
    nip: string
    jabatan: string
    departemen: string
    tanggal: string
    keterangan: string
    status: 'pending' | 'disetujui' | 'ditolak'
}

interface PageProps {
    lemburData: LemburData[]
}

export default function LemburIndex({ lemburData }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        {
            title: 'Pengajuan Lembur',
            href: '/app/lembur',
        },
    ]
    const { flash } = usePage().props as any
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })

    const [statusFilter, setStatusFilter] = useState('all')

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        const message = action === 'approve' ? 'menyetujui' : 'menolak'

        if (confirm(`Apakah Anda yakin ingin ${message} pengajuan lembur ini?`)) {
            router.put(`/app/lembur/${id}/status`, {
                action,
            })
        }
    }

    const filteredData = useMemo(() => {
        if (statusFilter === 'all') return lemburData
        return lemburData.filter((item) => item.status === statusFilter)
    }, [lemburData, statusFilter])

    const columns: ColumnDef<LemburData>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            sortable: true,
            className: 'w-24 pl-8 text-center',
            render: (_, index) => (
                <span className="text-gray-500">{index + 1}</span>
            ),
        },
        {
            header: 'Karyawan',
            accessorKey: 'nama',
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">{item.nama}</span>
                    <span className="text-xs text-gray-500">NIP: {item.nip}</span>
                </div>
            ),
        },
        {
            header: 'Jabatan',
            accessorKey: 'jabatan',
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-700">
                        {item.jabatan}
                    </span>
                </div>
            ),
        },
        {
            header: 'Departemen',
            accessorKey: 'departemen',
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-700">
                        {item.departemen}
                    </span>
                </div>
            ),
        },
        {
            header: 'Tanggal Lembur',
            accessorKey: 'tanggal',
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-700">
                        {item.tanggal}
                    </span>
                </div>
            ),
        },
        {
            header: '',
            className: 'text-center w-28',
            render: (item) =>
                item.status === 'pending' ? (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => handleAction(item.id, 'approve')}
                            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 shadow-sm"
                        >
                            <Check size={16} strokeWidth={2.5} />
                        </button>

                        <button
                            onClick={() => handleAction(item.id, 'reject')}
                            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <span className="text-xs text-gray-400 font-medium">
                            - Selesai -
                        </span>
                    </div>
                ),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Lembur" />
            {flash?.success && <Alert type="success" message={flash.success} />}
            {flash?.error && <Alert type="error" message={flash.error} />}

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="disetujui">Disetujui</option>
                    <option value="ditolak">Ditolak</option>
                </select>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <DynamicTable
                        title="Data Lembur Karyawan"
                        data={filteredData}
                        columns={columns}
                        searchKeys={[
                            'nama',
                            'nip',
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    )
}
