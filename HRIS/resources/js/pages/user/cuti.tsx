import { Head, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React, { useMemo, useState } from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import { BreadcrumbItem } from '@/types'
import FormModal from '@/components/modal-pengajuan'

export type CutiData = {
    id: number
    tanggal_mulai: string
    tanggal_selesai: string
    jenis_pengajuan: string
    alasan: string
    status: string
}

interface PageProps {
    cutiData: CutiData[]
}

export default function MyCuti({ cutiData }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Cuti Saya', href: '/app/my-cuti' },
    ]

    const [open, setOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('')

    const { data, setData, post, processing, reset } = useForm({
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_pengajuan: '',
        alasan: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        post('/app/my-cuti', {
            onSuccess: () => {
                reset()
                setOpen(false)
            },
        })
    }

    const formatDate = (d: string) =>
        new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })

    const filteredData = useMemo(() => {
        if (!statusFilter) return cutiData
        return cutiData.filter((i) => i.status === statusFilter)
    }, [cutiData, statusFilter])

    const columns: ColumnDef<CutiData>[] = [
        { header: 'No', render: (_, i) => i + 1 },
        { header: 'Tanggal Mulai', accessorKey: 'tanggal_mulai' },
        { header: 'Tanggal Selesai', accessorKey: 'tanggal_selesai' },
        {
            header: 'Jenis',
            accessorKey: 'jenis_pengajuan',
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs font-medium
            ${item.jenis_pengajuan === 'cuti'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                    {item.jenis_pengajuan.toUpperCase()}
                </span>
            )
        },

        { header: 'Alasan', accessorKey: 'alasan' },
        { header: 'Status', accessorKey: 'status' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuti Saya" />

            <div className="p-6 space-y-6">

                <div className="flex gap-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="px-3 py-2 border rounded-lg text-white shadow-sm focus:ring-2 focus:ring-red-500 bg-red-600"
                    >
                        + Ajukan Cuti
                    </button>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                </div>

                <DynamicTable
                    title="Riwayat Cuti Saya"
                    data={filteredData}
                    columns={columns}
                />

                <FormModal
                    open={open}
                    title="Ajukan Cuti"
                    processing={processing}
                    onClose={() => setOpen(false)}
                    onSubmit={submit}
                >
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="date"
                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                            required
                        />

                        <input
                            type="date"
                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                            required
                        />
                        <select
                            value={data.jenis_pengajuan}
                            onChange={e => setData('jenis_pengajuan', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        >
                            <option value="">Pilih Jenis Pengajuan</option>
                            <option value="cuti">Cuti</option>
                            <option value="izin">Izin</option>
                        </select>

                    </div>

                    <textarea
                        placeholder="Alasan"
                        onChange={(e) => setData('alasan', e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm"
                    />
                </FormModal>

            </div>
        </AppLayout>
    )
}
