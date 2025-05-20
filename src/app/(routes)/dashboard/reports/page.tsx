'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { findManyUsers } from '@/app/actions/users';
import { getReservations } from '@/app/actions/reservation';
import { FileSpreadsheet } from 'lucide-react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);

    try {
      const users = await findManyUsers();
      const reservations = await getReservations();
      exportToExcel(users, reservations);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (users: any[], reservations: any[]) => {
    const statusLabels: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado',
    };

    // Datos de usuarios
    const userData = users.map(user => ({
      'Usuario': user.username,
      'Email': user.email,
      'Rol': user.roleName,
      'Fecha Creación': new Date(user.createdAt).toLocaleDateString(),
    }));

    // Datos de reservaciones
    const reservationData = reservations.map(res => ({
      'ID': res.id,
      'Nombre': res.name,
      'Apellido': res.lastName,
      'Email': res.email,
      'Estado': statusLabels[res.status],
      'Huéspedes': res.guests,
      'Habitaciones': res.rooms,
      'Tipo de habitación': res.bedroomsType,
      'Fecha Llegada': new Date(res.arrivalDate).toLocaleDateString(),
      'Fecha Salida': new Date(res.departureDate).toLocaleDateString(),
      'Estancia (noches)': Math.ceil(
        (new Date(res.departureDate).getTime() - new Date(res.arrivalDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ),
    }));

    // Crear libro de Excel
    const wb = XLSX.utils.book_new();

    // Hoja de usuarios
    const wsUsers = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuarios');

    // Hoja de reservaciones
    const wsReservations = XLSX.utils.json_to_sheet(reservationData);
    XLSX.utils.book_append_sheet(wb, wsReservations, 'Reservaciones');

    // Guardar archivo
    XLSX.writeFile(wb, `Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Generar Reportes</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <Button
            onClick={generateReport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {loading ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </div>
    </div>
  );
}