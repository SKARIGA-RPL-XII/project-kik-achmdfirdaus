import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import {
    CheckCircle,
    XCircle,
    Info,
} from 'lucide-react'

type AlertProps = {
    type?: 'success' | 'error' | 'info'
    message: string
    duration?: number
    onClose?: () => void
}

export default function Alert({
    type = 'info',
    message,
    duration = 3000,
    onClose,
}: AlertProps) {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            close()
        }, duration)

        return () => clearTimeout(timer)
    }, [])

    function close() {
        setOpen(false)
        setTimeout(() => {
            onClose?.()
        }, 200)
    }

    const config = {
        success: {
            title: 'Berhasil',
            icon: <CheckCircle size={40} />,
            iconBg: 'bg-green-500',
            titleColor: 'text-green-600',
        },
        error: {
            title: 'Gagal',
            icon: <XCircle size={40} />,
            iconBg: 'bg-red-500',
            titleColor: 'text-red-600',
        },
        info: {
            title: 'Informasi',
            icon: <Info size={40} />,
            iconBg: 'bg-blue-500',
            titleColor: 'text-blue-600',
        },
    }[type]

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) close()
            }}
        >
            <DialogContent className="max-w-sm p-0 overflow-visible">
                <div className="flex justify-center">
                    <div
                        className={`-mt-10 flex h-20 w-20 items-center justify-center rounded-full ${config.iconBg} text-white shadow-lg`}
                    >
                        {config.icon}
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 text-center">
                    <h3 className={`text-lg font-semibold ${config.titleColor}`}>
                        {config.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                        {message}
                    </p>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={close}
                            className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
