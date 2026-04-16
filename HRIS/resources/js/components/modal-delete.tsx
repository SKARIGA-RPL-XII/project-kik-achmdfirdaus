import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type ModalDeleteProps = {
    open: boolean
    title?: string
    description?: string
    onClose: () => void
    onConfirm: () => void
}

export default function ModalDelete({
    open,
    title = 'Hapus Data',
    description = 'Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.',
    onClose,
    onConfirm,
}: ModalDeleteProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-gray-100">
                <VisuallyHidden>
                    <DialogTitle>{title}</DialogTitle>
                </VisuallyHidden>
                
                <div className="p-6 pb-8 flex flex-col items-center text-center gap-5 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-red-100/50 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-50/80 animate-in zoom-in duration-300 ring-8 ring-red-50/30">
                        <div className="absolute inset-0 rounded-full border border-red-100/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <AlertTriangle className="h-10 w-10 text-red-500 drop-shadow-sm" strokeWidth={2.5} />
                    </div>

                    <div className="space-y-2 z-10">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-900 to-red-600">
                            {title}
                        </h2>
                        <p className="text-sm font-medium text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 p-4 bg-gray-50 border-t border-gray-100/80">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto flex-1 rounded-xl border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 transition-colors h-11"
                    >
                        Batal
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="w-full sm:w-auto flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all duration-300 hover:shadow-lg active:scale-95 h-11 border-none"
                    >
                        Ya, Hapus Data
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
