import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 4,
        marginBottom: 4,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    colNama: { width: '25%' },
    colNip: { width: '15%' },
    colNumber: { width: '15%' },
    totalBox: {
        marginTop: 15,
        borderTopWidth: 1,
        paddingTop: 8,
    }
})

// 🔥 Formatter Rupiah
const rupiah = (value: any) => {
    const number = Number(value) || 0

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number).replace(/[\u202f\u00a0]/g, ' ')
}

export default function ReportPdf({ data, bulan }: any) {

    const totalSemua = data.reduce(
        (acc: number, item: any) => acc + (Number(item.total_gaji) || 0),
        0
    )


    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    Report Gaji Bulan {bulan}
                </Text>

                <View style={styles.tableHeader}>
                    <Text style={styles.colNama}>Nama</Text>
                    <Text style={styles.colNip}>NIP</Text>
                    <Text style={styles.colNumber}>Pokok</Text>
                    <Text style={styles.colNumber}>Lembur</Text>
                    <Text style={styles.colNumber}>Potongan</Text>
                    <Text style={styles.colNumber}>Total</Text>
                </View>

                {data.map((row: any, i: number) => (
                    <View style={styles.row} key={i}>
                        <Text style={styles.colNama}>{row.nama}</Text>
                        <Text style={styles.colNip}>{row.nip}</Text>
                        <Text style={styles.colNumber}>{rupiah(row.gaji_pokok)}</Text>
                        <Text style={styles.colNumber}>{rupiah(row.total_lembur)}</Text>
                        <Text style={styles.colNumber}>{rupiah(row.total_potongan)}</Text>
                        <Text style={styles.colNumber}>{rupiah(row.total_gaji)}</Text>
                    </View>
                ))}

                <View style={styles.totalBox}>
                    <Text>
                        Total Gaji Seluruh Karyawan: {rupiah(totalSemua)}
                    </Text>
                </View>

            </Page>
        </Document>
    )
}
