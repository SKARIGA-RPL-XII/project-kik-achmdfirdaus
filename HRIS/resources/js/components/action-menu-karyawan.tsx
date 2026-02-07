import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Pencil, Trash2, KeyRound, AlertTriangle } from 'lucide-react'

type Props = {
    onEdit: () => void
    onDelete: () => void
    onReset: () => void
    onPelanggaran: () => void
}

export default function ActionKaryawanMenu({
    onEdit,
    onDelete,
    onReset,
    onPelanggaran,
}: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: any) => {
            if (!ref.current?.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded hover:bg-gray-100"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50 text-sm">

                    <MenuItem icon={<Pencil size={14} />} label="Edit" onClick={onEdit} />

                    <MenuItem icon={<KeyRound size={14} />} label="Reset Password" onClick={onReset} />

                    <MenuItem icon={<AlertTriangle size={14} />} label="Pelanggaran" onClick={onPelanggaran} />

                    <MenuItem
                        icon={<Trash2 size={14} />}
                        label="Hapus"
                        onClick={onDelete}
                        danger
                    />
                </div>
            )}
        </div>
    )
}

function MenuItem({ icon, label, onClick, danger = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 ${danger ? 'text-red-600' : ''
                }`}
        >
            {icon}
            {label}
        </button>
    )
}
