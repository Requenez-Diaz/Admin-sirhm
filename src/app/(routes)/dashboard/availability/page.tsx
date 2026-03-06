import { getTypeBedrooms } from "@/app/actions/bedrooms/getTypeBedrooms";
import AvailabilityClient from "./AvailabilityClient";

export default async function AvailabilityPage() {
    const types = await getTypeBedrooms();

    // Mapeamos para evitar problemas de serialización de fechas en el cliente
    const roomTypes = types.map(t => ({
        id: t.id,
        nameType: t.nameType,
        description: t.description
    }));

    return <AvailabilityClient roomTypes={roomTypes} />;
}
