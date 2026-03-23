import { getTypeBedrooms } from "@/app/actions/roomsType/rooms-type";
import {
  TableTypeHeader,
  TableTypeActions,
} from "./components/tableTypeContent";
import TypeBedroomsTable from "./components/tableTypeContent";

export default async function TypeBedroomsPage() {
  const result = await getTypeBedrooms();

  return (
    <div className="p-6 space-y-6">
      <TableTypeHeader />
      <TableTypeActions />
      <TypeBedroomsTable data={result.data || []} />
    </div>
  );
}
