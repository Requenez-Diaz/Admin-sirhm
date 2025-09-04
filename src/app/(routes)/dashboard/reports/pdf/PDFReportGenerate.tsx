'use client';
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { getReservations } from '@/app/actions/reservation';
import PDFReportHeader from './PdfReportHeader';
import PDFReservationSummary from './PDFReservationSummary';
import PDFTopRoomTypes from './PDFTopRoomTypes';
import PDFTotalGuests from './PDFTotalGuests';
import PDFHighDemandDays from './PDFHighDemandDays';
import { getBedrooms } from '@/app/actions/bedrooms';

interface Reservation {
    arrivalDate: string | Date;
    roomType: string;
    guests: number;
}

const PDFReportGenerate: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const currentUser = 'Administrador';

    useEffect(() => {
        (async () => {
            try {
                const data = await getReservations();
                const mapped = data.map(res => ({
                    arrivalDate: res.arrivalDate,
                    roomType: res.bedroomsType,
                    guests: res.guests
                }));
                setReservations(mapped);
            } catch (error) {
                console.error('Error cargando reservas:', error);
            }
        })();
    }, []);

    const generatePDF = async () => {
        if (reservations.length === 0) {
            alert('No hay datos de reservas disponibles para generar el reporte.');
            return;
        }

        const doc = new jsPDF();
        const now = new Date();

        const generatedAt = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        // Calcular periodo del mes actual
        const dates = reservations.map(r => new Date(r.arrivalDate));
        const validDates = dates.filter(date => !isNaN(date.getTime()));
        const minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
        const reportPeriod = `${minDate.toLocaleDateString('es-ES')} - ${maxDate.toLocaleDateString('es-ES')}`;

        // Secciones del PDF
        PDFReportHeader({ doc, generatedBy: currentUser, generatedAt, reportPeriod });

        PDFReservationSummary({ doc, total: reservations.length });

        PDFTotalGuests({ doc, guestsCounts: reservations.map(r => r.guests) });

        // **Traer habitaciones aquí y generar los tipos**
        const bedrooms = await getBedrooms();
        const roomTypesCount: Record<string, number> = {};
        bedrooms.forEach(b => {
            const type = b.typeBedroom || 'Desconocido';
            roomTypesCount[type] = (roomTypesCount[type] || 0) + 1;
        });

        PDFTopRoomTypes({ doc, roomTypesCount });

        PDFHighDemandDays({ doc, arrivalDates: reservations.map(r => r.arrivalDate) });

        // Guardar PDF
        doc.save(`Reporte_Hotel_Madroño_${now.toISOString().split('T')[0]}.pdf`);
    };

    return (
        <Button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            size="lg"
        >
            <FileText className="h-5 w-5" />
            Generar Reporte PDF
        </Button>
    );
};

export default PDFReportGenerate;
