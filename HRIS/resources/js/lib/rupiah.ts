export function formatRupiah(value: number | string) {
    if (!value) return ''

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value))
}

export function parseRupiah(value: string) {
    return Number(value.replace(/[^0-9]/g, ''))
}
