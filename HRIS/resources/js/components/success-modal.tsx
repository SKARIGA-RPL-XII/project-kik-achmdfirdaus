import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    title?: string;
}

const SuccessModal = ({
    isOpen,
    onClose,
    title = "Berhasil",
    message = "Data karyawan berhasil diperbarui."
}: SuccessModalProps) => {

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm p-8 overflow-hidden bg-white rounded-3xl gap-6 shadow-2xl border-none outline-none flex flex-col items-center justify-center [&>button]:hidden">

                <VisuallyHidden>
                    <DialogTitle>Notifikasi Berhasil</DialogTitle>
                </VisuallyHidden>

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 animate-in zoom-in duration-300">
                    <Check className="h-12 w-12 text-emerald-600" strokeWidth={3} />
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed">
                        {message}
                    </p>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default SuccessModal;
