import { Head, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React, { useMemo, useState } from 'react'
import DynamicTable, { ColumnDef } from '@/components/dynamic-table'
import FormModal from '@/components/modal-pengajuan'
import { BreadcrumbItem } from '@/types'

export type LemburData = {
    id: number
    tanggal: string
    status: string
}

interface PageProps {
    lemburData: LemburData[]
}

export default function MyLembur({ lemburData }: PageProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App', href: '/app' },
        { title: 'Lembur Saya', href: '/app/my-lembur' },
    ]

    const [open, setOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('')

    const { data, setData, post, processing, reset } = useForm({
        tanggal: ''
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        post('/app/my-lembur', {
            onSuccess: () => {
                reset()
                setOpen(false)
            }
        })
    }

    const filteredData = useMemo(() => {
        if (!statusFilter) return lemburData
        return lemburData.filter(i => i.status === statusFilter)
    }, [lemburData, statusFilter])

    const formatDate = (d: string) =>
        new Date(d + 'T00:00:00').toLocaleDateString('id-ID')

    const columns: ColumnDef<LemburData>[] = [
        { header: 'No', render: (_, i) => i + 1 },

        {
            header: 'Tanggal',
            accessorKey: 'tanggal',
            render: (item) => formatDate(item.tanggal)
        },

        {
            header: 'Status',
            accessorKey: 'status',
            render: (item) => {
                const s = item.status

                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium
                        ${s === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : s === 'disetujui'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                        {s.toUpperCase()}
                    </span>
                )
            }
        }
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lembur Saya" />

            <div className="p-6 space-y-6">

                <div className="flex gap-3">

                    <button
                        onClick={() => setOpen(true)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white"
                    >
                        + Ajukan Lembur
                    </button>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                    </select>

                </div>

                <DynamicTable
                    title="Riwayat Lembur Saya"
                    data={filteredData}
                    columns={columns}
                />

                <FormModal
                    open={open}
                    title="Ajukan Lembur"
                    processing={processing}
                    onClose={() => setOpen(false)}
                    onSubmit={submit}
                >
                    <input
                        type="date"
                        value={data.tanggal}
                        onChange={(e) => setData('tanggal', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                        required
                    />
                </FormModal>

            </div>
        </AppLayout>
    )
}
