import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function Action({
    onEdit,
    onDelete,
}: ActionMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const close = () => setOpen(false);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="p-1 rounded hover:bg-gray-100 transition"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-24 rounded-md border bg-white shadow-lg text-xs z-20 overflow-hidden animate-in fade-in zoom-in-95">
                    <button
                        onClick={() => {
                            onEdit();
                            close();
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            close();
                        }}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
