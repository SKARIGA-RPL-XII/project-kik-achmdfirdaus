import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

interface Props {
    open: boolean
    title: string
    processing?: boolean
    onClose: () => void
    onSubmit: (e: React.FormEvent) => void
    children: React.ReactNode
    width?: string
}

export default function FormModal({
    open,
    title,
    processing,
    onClose,
    onSubmit,
    children,
    width = 'sm:max-w-md',
}: Props) {
    return (
        <Dialog open={open} onOpenChange={(s) => !s && onClose()}>
            <DialogContent className={`${width} p-6 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border-gray-100`}>
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-5">

                    <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-200">
                        {children}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            Batal
                        </Button>

                        <Button 
                            disabled={processing}
                            className="rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20 transition-all duration-300 active:scale-95"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Menyimpan...
                                </span>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
