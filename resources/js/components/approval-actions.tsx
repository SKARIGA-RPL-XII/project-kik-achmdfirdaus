import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

type Props = {
    id: number
    status: string
    baseUrl: string
    onDeleted?: () => void
}

export default function ApprovalActions({
    id,
    status,
    baseUrl,
    onDeleted,
}: Props) {
    function updateStatus(newStatus: 'disetujui' | 'ditolak') {
        router.put(`${baseUrl}/${id}/status`, { status: newStatus }, {
            preserveScroll: true,
        })
    }

    function remove() {
        router.delete(`${baseUrl}/${id}`, {
            preserveScroll: true,
            onSuccess: onDeleted,
        })
    }

    if (status !== 'pending') {
        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium
                ${status === 'diterima'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
            >
                {status}
            </span>
        )
    }

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => updateStatus('disetujui')}
            >
                ACC
            </Button>

            <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => updateStatus('ditolak')}
            >
                Tolak
            </Button>

            <Button
                size="sm"
                variant="destructive"
                onClick={remove}
            >
                Hapus
            </Button>
        </div>
    )
}
