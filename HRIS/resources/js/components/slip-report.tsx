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
        fontSize: 11,
        fontFamily: 'Helvetica'
    },
    title: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    section: {
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    divider: {
        borderBottomWidth: 1,
        marginVertical: 10
    },
    total: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    footer: {
        marginTop: 30,
        fontSize: 9,
        textAlign: 'right'
    }
})

function rupiah(value: any) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Number(value) || 0)
}

export default function SlipPdf({ data, bulan }: any) {

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>
                    SLIP GAJI BULAN {bulan}
                </Text>

                <View style={styles.section}>
                    <Text>Nama : {data?.nama ? data.nama : 'KOSONG'}</Text>
                    <Text>NIP : {data?.nip ? data.nip : 'KOSONG'}</Text>
                    <Text>Jabatan : {data?.jabatan ? data.jabatan : 'KOSONG'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text>Gaji Pokok</Text>
                        <Text>{rupiah(data.gaji_pokok)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Total Lembur</Text>
                        <Text>{rupiah(data.total_lembur)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Total Potongan</Text>
                        <Text>{rupiah(data.total_potongan)}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.total}>Total Gaji</Text>
                    <Text style={styles.total}>
                        {rupiah(data.total_gaji)}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text>
                        Dicetak pada: {new Date().toLocaleDateString('id-ID')}
                    </Text>
                </View>

            </Page>
        </Document>
    )
}
