import React, { useEffect, useState } from 'react';
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
    message
}: SuccessModalProps) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isOpen) {
            setProgress(100);
            return;
        }

        const duration = 2000;
        const interval = 10;
        const steps = duration / interval;
        const decrement = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - decrement;
            });
        }, interval);

        const closeTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(closeTimer);
        };
    }, [isOpen, onClose]);

    if (!message) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center [&>button]:hidden">
                <div className="p-8 pb-10 flex flex-col items-center gap-6 w-full relative">
                    <VisuallyHidden>
                        <DialogTitle>Notifikasi Berhasil</DialogTitle>
                    </VisuallyHidden>

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 animate-in zoom-in duration-500 shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)]">
                        {/* Ripple pulses */}
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
                        
                        <Check className="h-12 w-12 text-emerald-500 drop-shadow-sm" strokeWidth={3.5} />
                    </div>

                    <div className="flex flex-col items-center gap-2.5 text-center mt-2">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-900 to-emerald-700 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Progress bar at bottom */}
                <div className="w-full h-1.5 bg-gray-100 relative overflow-hidden">
                    <div 
                        className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-[10ms] ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SuccessModal;
