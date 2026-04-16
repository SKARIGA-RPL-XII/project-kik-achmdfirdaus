import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import React, { useMemo, useState } from 'react'
import { BreadcrumbItem } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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

const getStatusStyles = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'hadir':
            return 'bg-[#21b27b] w-6 h-6'
        case 'izin':
            return 'bg-[#3b82f6] w-6 h-6'
        case 'cuti':
            return 'bg-[#a855f7] w-6 h-6'
        case 'alpha':
            return 'bg-[#ef4444] w-6 h-6'
        default:
            return 'bg-transparent border-[2.5px] border-[#eab308] w-6 h-6'
    }
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

    const [statusFilter, setStatusFilter] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [monthFilter, setMonthFilter] = useState(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })

    const formatDateObj = (dateStr: string) => new Date(dateStr)
    const formatDayShort = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' })
    const formatMonthShort = (date: Date) => date.toLocaleDateString('en-US', { month: 'short' })

    const filteredData = useMemo(() => {
        let data = [...absensiData]

        if (statusFilter) {
            data = data.filter((i) => i.status === statusFilter)
        }
        if (monthFilter) {
            const [y, m] = monthFilter.split('-').map(Number)
            data = data.filter((i) => {
                const date = formatDateObj(i.tanggal)
                return date.getFullYear() === y && date.getMonth() === (m - 1)
            })
        }
        if (from) {
            data = data.filter((i) => formatDateObj(i.tanggal) >= formatDateObj(from))
        }
        if (to) {
            data = data.filter((i) => formatDateObj(i.tanggal) <= formatDateObj(to))
        }

        return data
    }, [absensiData, statusFilter, monthFilter, from, to])

    const dateColumns = useMemo(() => {
        const uniqueDatesStr = Array.from(new Set(filteredData.map(d => d.tanggal)))
        return uniqueDatesStr.sort((a, b) => formatDateObj(a).getTime() - formatDateObj(b).getTime())
    }, [filteredData])

    const employeeRows = useMemo(() => {
        const employeesMap = new Map<string, {
            nip: string,
            nama: string,
            jabatan: string,
            departemen: string,
            attendances: Record<string, AbsensiData>
        }>()

        filteredData.forEach(d => {
            if (!employeesMap.has(d.nip)) {
                employeesMap.set(d.nip, {
                    nip: d.nip,
                    nama: d.nama,
                    jabatan: d.jabatan,
                    departemen: d.departemen,
                    attendances: {}
                })
            }
            employeesMap.get(d.nip)!.attendances[d.tanggal] = d;
        })

        return Array.from(employeesMap.values())
    }, [filteredData])

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />

            <div className="p-6 max-w-[1600px] mx-auto space-y-6">

                <div className="flex flex-wrap gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                    >
                        <option value="">Semua Status</option>
                        <option value="hadir">Hadir</option>
                        <option value="izin">Izin</option>
                        <option value="cuti">Cuti</option>
                        <option value="alpha">Alpha</option>
                    </select>

                    <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => {
                            setMonthFilter(e.target.value)
                            setFrom('')
                            setTo('')
                        }}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        title="Filter Berdasarkan Bulan"
                    />

                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value)
                            setMonthFilter('')
                        }}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        title="Rentang Awal"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                            setTo(e.target.value)
                            setMonthFilter('')
                        }}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        title="Rentang Akhir"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-md border flex flex-col w-full overflow-hidden">
                    <div className="w-full overflow-x-auto pb-4">
                        <table className="w-full text-sm text-left whitespace-nowrap min-w-max border-b border-gray-100">
                            <thead className="bg-[#fcfdfd] text-gray-700 border-b">
                                <tr>
                                    <th className="font-semibold w-[280px] sticky left-0 z-20 bg-[#fcfdfd] border-r align-middle p-0">
                                        <div className="flex items-center gap-2 px-6 py-4 h-full">
                                            Nama
                                            <div className="w-4 h-4 rounded-full bg-gray-500 text-white flex items-center justify-center text-[10px] cursor-help" title="Employee Details">?</div>
                                        </div>
                                    </th>
                                    {dateColumns.map(dateStr => {
                                        const d = formatDateObj(dateStr)
                                        const isWeekend = d.getDay() === 0 || d.getDay() === 6
                                        return (
                                            <th key={dateStr} className="px-4 py-4 min-w-[80px] text-center border-r last:border-r-0">
                                                <div className="flex flex-col items-center justify-center select-none">
                                                    <span className={`text-[11px] font-medium uppercase tracking-wider ${isWeekend ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        {formatDayShort(d)}
                                                    </span>
                                                    <span className={`text-base font-bold my-0.5 ${isWeekend ? 'text-blue-600' : 'text-gray-800'}`}>
                                                        {d.getDate().toString().padStart(2, '0')}
                                                    </span>
                                                    <span className={`text-[11px] uppercase tracking-wider ${isWeekend ? 'text-blue-400' : 'text-gray-400'}`}>
                                                        {formatMonthShort(d)}
                                                    </span>
                                                </div>
                                            </th>
                                        )
                                    })}
                                    {dateColumns.length === 0 && (
                                        <th className="px-4 py-4 text-center text-gray-400 italic font-normal">Tidak ada data tanggal.</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {employeeRows.map((emp, index) => (
                                    <tr key={emp.nip} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>

                                        <td className={`sticky left-0 z-10 border-r align-middle p-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                                            <div className="flex items-center gap-4 px-6 py-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-red-50 text-red-700 font-semibold">{getInitials(emp.nama)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col max-w-[180px]">
                                                    <span className="font-semibold text-gray-800 truncate" title={emp.nama}>{emp.nama}</span>
                                                    <span className="text-xs text-gray-500 truncate" title={`${emp.jabatan} - ${emp.departemen}`}>{emp.jabatan} - {emp.departemen}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {dateColumns.map(dateStr => {
                                            const record = emp.attendances[dateStr]

                                            if (!record) {
                                                return <td key={`${emp.nip}-${dateStr}`} className="px-4 py-4 text-center border-r last:border-r-0 border-dashed"></td>
                                            }

                                            return (
                                                <td key={`${emp.nip}-${dateStr}`} className="px-4 py-4 text-center border-r last:border-r-0 border-dashed align-middle relative">
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className={`rounded-full transition-transform hover:scale-110 cursor-pointer ${getStatusStyles(record.status)}`}
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                side="top"
                                                                className="bg-white text-slate-800 border-gray-200 border shadow-2xl p-4 flex flex-col gap-2 relative z-[100] min-w-[200px]"
                                                            >
                                                                <div className="flex flex-col gap-1 border-b pb-2 mb-1">
                                                                    <span className="font-bold text-base text-gray-900">{record.nama}</span>
                                                                    <span className="text-xs text-gray-500">{new Date(record.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-1">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] uppercase text-gray-400 font-semibold">Status</span>
                                                                        <span className="font-medium capitalize text-gray-800">{record.status}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] uppercase text-gray-400 font-semibold">Jam Kerja</span>
                                                                        <span className="font-medium text-gray-800">{record.jam_masuk} - {record.jam_pulang}</span>
                                                                    </div>
                                                                </div>
                                                                {record.keterangan && (
                                                                    <div className="flex flex-col mt-2 pt-2 border-t">
                                                                        <span className="text-[10px] uppercase text-gray-400 font-semibold">Keterangan</span>
                                                                        <span className="text-xs text-gray-600 line-clamp-2">{record.keterangan}</span>
                                                                    </div>
                                                                )}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}

                                {employeeRows.length === 0 && dateColumns.length > 0 && (
                                    <tr>
                                        <td colSpan={dateColumns.length + 1} className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                            Tidak ada data absensi yang sesuai kriteria pencarian.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 flex flex-wrap gap-6 items-center bg-gray-50/50 text-sm border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#21b27b]"></div>
                            <span className="text-gray-600">Hadir</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
                            <span className="text-gray-600">Izin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#a855f7]"></div>
                            <span className="text-gray-600">Cuti</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 flex-shrink-0 rounded-full bg-[#ef4444]"></div>
                            <span className="text-gray-600">Alpha</span>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}
