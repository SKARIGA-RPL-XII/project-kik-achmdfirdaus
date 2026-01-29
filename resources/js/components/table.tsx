import { ReactNode } from 'react'

export type Column<T> = {
    label: string
    render: (row: T) => ReactNode
}

type Props<T> = {
    data: T[]
    columns: Column<T>[]
}

export default function Table<T>({ data, columns }: Props<T>) {
    return (
        <table className="w-full border">
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th key={i} className="p-2 text-left border-b">
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 && (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="p-4 text-center text-gray-500"
                        >
                            Data tidak ditemukan
                        </td>
                    </tr>
                )}

                {data.map((row, i) => (
                    <tr key={i} className="border-b">
                        {columns.map((col, j) => (
                            <td key={j} className="p-2">
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
