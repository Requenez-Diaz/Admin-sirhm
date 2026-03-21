interface TableReservationFooterProps {
  totalCount: number;
}

export function TableReservationFooter({
  totalCount,
}: TableReservationFooterProps) {
  return (
    <tfoot className='bg-muted/50 border-t-2 border-border'>
      <tr className='font-black text-xs uppercase tracking-tighter text-foreground'>
        <td className='px-6 py-4 text-left' colSpan={13}>
          Total Registros:{" "}
          <span className='text-primary'>{totalCount} Reservas</span>
        </td>
      </tr>
    </tfoot>
  );
}
