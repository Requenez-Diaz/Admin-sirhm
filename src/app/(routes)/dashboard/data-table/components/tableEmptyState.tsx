import { TableRow, TableCell } from "@/components/ui/table";

export function TableEmptyState() {
  return (
    <TableRow>
      <TableCell
        colSpan={13}
        className="text-center py-12 text-muted-foreground"
      >
        No se encontraron reservaciones que coincidan con los filtros.
      </TableCell>
    </TableRow>
  );
}
