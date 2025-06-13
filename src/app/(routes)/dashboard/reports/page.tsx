import ExcelReportGenerator from './GenerateExcelReport'
import ReportsPage from './ReportDashboard'

export default async function DashboardPage() {

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Reservas</h1>
      <ExcelReportGenerator />
      <ReportsPage />
    </div>
  )
}
