import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // Listen for Inertia navigation start
        const removeStart = router.on('start', () => {
            // Only show loader if request takes more than 150ms (prevents flashing on fast connections)
            timeout = setTimeout(() => {
                setIsLoading(true);
            }, 150);
        });

        // Listen for Inertia navigation finish (always called regardless of success/error)
        const removeFinish = router.on('finish', () => {
            clearTimeout(timeout);
            setIsLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();
            clearTimeout(timeout);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-5 bg-white/90 p-8 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] border border-white/50 backdrop-blur-md animate-in zoom-in-95 duration-300 relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#dc2626]/10 blur-2xl rounded-full"></div>

                <div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Soft background ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-[#dc2626]/10"></div>
                    
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-[#dc2626] border-r-transparent border-t-transparent animate-[spin_1s_cubic-bezier(0.55,0.15,0.45,0.85)_infinite]"></div>
                    
                    {/* Inner pulse circle */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#dc2626] to-red-500 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.3)]"></div>
                </div>

                <div className="space-y-1.5 text-center relative z-10">
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
                        Memuat Data...
                    </h3>
                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                        Mohon tunggu sebentar
                    </p>
                </div>
            </div>
        </div>
    );
}
