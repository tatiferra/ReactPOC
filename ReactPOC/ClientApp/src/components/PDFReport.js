import React from 'react';
import { Page, Document, View, Text, StyleSheet, PDFViewer } from '@react-pdf/renderer';


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

class PDFReport extends React.Component {
    formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    render() {
        const { rows } = this.props;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Reporte de Ingresos</Text>
                        {rows.map((row) => (
                            <Text key={row.id}>
                                Nombre del evento: {row.evento}
                                Expositor: {row.expositor}
                                Empresa: {row.empresa}
                                Fecha: {this.formatDateTime(row.fechaIngreso)}
                            </Text>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    }
}

export default PDFReport;
