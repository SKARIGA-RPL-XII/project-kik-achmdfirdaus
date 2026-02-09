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
            <DialogContent className={width}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">

                    {children}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Batal
                        </Button>

                        <Button disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
