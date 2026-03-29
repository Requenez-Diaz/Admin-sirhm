interface TableRoleFooterProps {
  totalCount: number;
}

export function TableRoleFooter({ totalCount }: TableRoleFooterProps) {
  return (
    <div className="flex justify-center pt-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
        Total de roles definidos: {totalCount}
      </p>
    </div>
  );
}
