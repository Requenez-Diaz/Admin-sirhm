interface TableUserFooterProps {
  totalCount: number;
}

export function TableUserFooter({ totalCount }: TableUserFooterProps) {
  return (
    <div className="flex justify-center pt-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
        Total de usuarios: {totalCount}
      </p>
    </div>
  );
}
