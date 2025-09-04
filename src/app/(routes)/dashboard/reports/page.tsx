import { getReservations } from '@/app/actions/reservation'
import RoomTypeTable from './RoomTypeTable'
import ExcelReportGenerator from './GenerateExcelReport'
import ReportsPage from './ReportDashboard'
import PDFReportGenerate from './pdf/PDFReportGenerate'

export default async function DashboardPage() {
  const reservations = await getReservations()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Reservas</h1>

      <div className="flex flex-col md:flex-row items-center md:items-center justify-between py-3 px-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">
          Opciones de Exportación
        </h2>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <ExcelReportGenerator />
          <PDFReportGenerate />
        </div>
      </div>

      <ReportsPage />
      <RoomTypeTable reservations={reservations} />
    </div>
  )
}
