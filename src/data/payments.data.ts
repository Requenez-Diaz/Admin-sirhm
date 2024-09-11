
export type Payment = {
    id: string;
    clientName: string;
    lastName: string;
    email: string;
    status: "pending" | "processing" | "success" | "failed";
    guestCount: number;
    roomCount: number;
    bedroomsTypes: string;
    stay: string;
};
