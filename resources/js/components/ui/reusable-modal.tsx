import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReusableFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    width?: string;
}

const ReusableFormModal = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = "Simpan",
    cancelLabel = "Batal",
    isLoading = false,
    width = "sm:max-w-4xl"
}: ReusableFormModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`${width} p-0 overflow-hidden bg-white gap-0 rounded-2xl border-none shadow-2xl [&>button]:hidden`}>

                <DialogHeader className="px-8 py-6 border-b border-gray-100">
                    <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
                    <form id="reusable-form" onSubmit={onSubmit}>
                        {children}
                    </form>
                </div>

                <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-white">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-white h-11 px-8 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        type="submit"
                        form="reusable-form"
                        disabled={isLoading}
                        className="h-11 px-8 rounded-lg bg-[#114F38] text-white hover:bg-[#0d3f2d] font-medium shadow-md transition-all"
                    >
                        {isLoading ? "Menyimpan..." : submitLabel}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ReusableFormModal;