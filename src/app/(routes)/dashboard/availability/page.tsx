import { getTypeBedrooms } from "@/app/actions/bedrooms/getTypeBedrooms";
import AvailabilityClient from "./AvailabilityClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    typeId?: string;
  }>;
}) {
  const params = await searchParams;
  const types = await getTypeBedrooms();

  const roomTypes = types.map((t) => ({
    id: t.id,
    nameType: t.nameType,
    description: t.description,
  }));

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AvailabilityClient
        roomTypes={roomTypes}
        initialCheckIn={params.checkIn}
        initialCheckOut={params.checkOut}
        initialTypeId={params.typeId}
      />
    </Suspense>
  );
}
