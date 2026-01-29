type Props = {
    page: number
    totalPage: number
    onChange: (page: number) => void
}

export default function Pagination({ page, totalPage, onChange }: Props) {
    if (totalPage <= 1) return null

    return (
        <div className="flex gap-1">
            {Array.from({ length: totalPage }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i + 1)}
                    className={`px-3 py-1 border rounded ${page === i + 1
                            ? 'bg-blue-600 text-white'
                            : ''
                        }`}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    )
}
