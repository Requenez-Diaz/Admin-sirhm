import { getReservations } from '@/app/actions/reservation'
import RoomTypeTable from './RoomTypeTable'
import ExcelReportGenerator from './GenerateExcelReport'
import ReportsPage from './ReportDashboard'
import PDFReportGenerate from './PDFReportGenerate'

export default async function DashboardPage() {
  const reservations = await getReservations()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Reservas</h1>
      <ExcelReportGenerator />
      <PDFReportGenerate />
      <ReportsPage />
      <RoomTypeTable reservations={reservations} />
    </div>
  )
}
