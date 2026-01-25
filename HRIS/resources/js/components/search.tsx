type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Cari...',
}: Props) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border rounded px-3 py-2 w-64"
        />
    )
}
