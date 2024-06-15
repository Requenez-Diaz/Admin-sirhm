
import { payments } from "@/data/payments.data";
import { DataTable } from "../data-table/data-table";
import { columns } from "../data-table/columns";


async function fetchData() {
  return payments;
}

export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
