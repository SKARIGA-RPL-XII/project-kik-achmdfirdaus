import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
} from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
    sortable?: boolean;
    id?: string;
    hidden?: 'mobile' | 'tablet' | 'never';
}

interface DynamicTableProps<T> {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
    searchKeys?: (keyof T)[];
    onAddClick?: () => void;
    addButtonLabel?: string;
    headerSlot?: React.ReactNode;
}

function DynamicTable<T extends { id: string | number }>({
    title,
    data,
    columns,
    searchKeys = [],
    onAddClick,
    addButtonLabel = 'Tambah Data',
    headerSlot,
}: DynamicTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        if (searchTerm && searchKeys.length > 0) {
            result = result.filter((item) =>
                searchKeys.some((key) => {
                    const value = item[key];
                    return String(value)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                }),
            );
        }

        if (sortConfig) {
            result.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, sortConfig, searchKeys]);

    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedData = filteredAndSortedData.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const handleSort = useCallback((key: keyof T) => {
        setSortConfig((prev) => {
            let direction: 'asc' | 'desc' = 'asc';
            if (prev && prev.key === key && prev.direction === 'asc') {
                direction = 'desc';
            }
            return { key, direction };
        });
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
            }
        },
        [totalPages],
    );

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);
            setCurrentPage(1);
        },
        [],
    );
    

    // Maintain focus after state updates
    useEffect(() => {
        if (
            isSearchFocused &&
            searchInputRef.current &&
            document.activeElement !== searchInputRef.current
        ) {
            searchInputRef.current.focus();
        }
    }, [searchTerm, isSearchFocused]);

    const handleItemsPerPageChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
        },
        [],
    );

    return (
        <Card className="flex w-full flex-col overflow-hidden rounded-3xl border-none bg-white shadow-sm">
            <CardHeader className="px-4 pt-6 pb-4 sm:px-8">
                {headerSlot ? (
                    headerSlot
                ) : (
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            {title}
                        </CardTitle>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    autoComplete="off"
                                    className="h-10 w-full rounded-lg border-gray-200 bg-white pl-10 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            {onAddClick && (
                                <Button
                                    onClick={onAddClick}
                                    className="h-10 w-full rounded-lg bg-[#114F38] px-6 text-white hover:bg-[#0d3f2d] sm:w-auto"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {addButtonLabel}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 px-0 pb-0">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-gray-100 bg-white text-gray-500">
                            <tr>
                                {columns.map((col, idx) => {
                                    let colClasses =
                                        'px-2 py-3 sm:px-4 sm:py-4 font-medium whitespace-nowrap text-xs sm:text-sm';
                                    if (col.hidden === 'mobile') {
                                        colClasses += ' hidden md:table-cell';
                                    } else if (col.hidden === 'tablet') {
                                        colClasses += ' hidden lg:table-cell';
                                    }

                                    return (
                                        <th
                                            key={idx}
                                            className={`${colClasses} ${col.className || ''}`}
                                        >
                                            {col.sortable && col.accessorKey ? (
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            col.accessorKey!,
                                                        )
                                                    }
                                                    className="group flex items-center gap-1 hover:text-gray-900 focus:outline-none"
                                                >
                                                    {col.header}
                                                    <ArrowUpDown className="h-3 w-3 text-gray-400 transition-colors group-hover:text-gray-900" />
                                                </button>
                                            ) : (
                                                col.header
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, rowIdx) => (
                                    <tr
                                        key={item.id}
                                        className="group transition-colors hover:bg-gray-50/50"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={`px-4 py-5 align-top font-medium whitespace-nowrap text-gray-900 ${col.className || ''}`}
                                            >
                                                {col.render
                                                    ? col.render(
                                                          item,
                                                          startIndex + rowIdx,
                                                      )
                                                    : col.accessorKey
                                                      ? (item[
                                                            col.accessorKey
                                                        ] as React.ReactNode)
                                                      : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:px-8 sm:py-6">
                <div className="flex w-full items-center justify-center gap-2 text-sm text-gray-600 sm:w-auto sm:justify-start">
                    <span>Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="h-8 cursor-pointer rounded-md border-gray-200 bg-white text-xs focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="hidden sm:inline">per page</span>
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
                    <span className="text-xs text-gray-600 sm:text-sm">
                        {totalItems === 0
                            ? '0'
                            : `${startIndex + 1}-${endIndex}`}{' '}
                        of {totalItems}
                    </span>

                    <div className="flex flex-wrap items-center justify-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent sm:h-8 sm:w-8"
                        >
                            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>

                        {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 3 + i + 1;
                                    if (pageNum > totalPages) return null;
                                }
                                if (!pageNum) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            },
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent sm:h-8 sm:w-8"
                        >
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default DynamicTable;
