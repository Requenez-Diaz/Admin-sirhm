
export const calculateDuration = (arrivalDate: string, departureDate: string): number => {
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    const duration = (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    return Math.round(duration);
};
