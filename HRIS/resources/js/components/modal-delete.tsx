import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    {description}
                </p>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Batal
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Ya, Hapus
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
