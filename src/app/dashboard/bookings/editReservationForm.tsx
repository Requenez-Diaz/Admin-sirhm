'use client';

import { updateReservation } from '@/app/actions/reservation/updateReservation';
import { bedroomsTypes } from '@/bedroomstype/bedroomsType';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icons/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { Reservation } from '@prisma/client';

export function FormEditReservation({ reservation, }: { reservation: Reservation | null }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append("reservationId", reservation?.id.toString() ?? "");
        await updateReservation(formData);

        if (!reservation) {
            return <p>Error: No se encontró la reservación</p>
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-right" htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" type="text" placeholder='Nombre' defaultValue={reservation?.name} required />
                </div>
                <div>
                    <Label className="text-right" htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" name="lastName" type="text" placeholder='Apellido' defaultValue={reservation?.lastName} required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-right" htmlFor="email">Correo</Label>
                    <Input id="email" name="email" type="email" placeholder='Correo electronico' defaultValue={reservation?.email} required />
                </div>
                <div>
                    <Label className="text-right" htmlFor="guests">Huéspedes</Label>
                    <Input id="guests" name="guests" type="number" min="1" placeholder="Número de personas" defaultValue={reservation?.guests} required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-right" htmlFor="rooms">Habitaciones</Label>
                    <Input id="rooms" name="rooms" type="number" min="1" placeholder="Cantidad de habitaciones" defaultValue={reservation?.rooms} required />
                </div>
                <div>
                    <Label className="text-right" htmlFor="bedroomsType">Tipo de habitación</Label>
                    <select className="border border-gray-300 rounded-lg p-2" id="bedroomsType" name="bedroomsType" required defaultValue={reservation?.bedroomsType} >
                        <option value="" disabled>Selecciona el tipo de habitación</option>
                        {bedroomsTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-right" htmlFor="arrivalDate">Fecha de llegada</Label>
                    <Input id="arrivalDate" name="arrivalDate" type="date" required defaultValue={reservation?.arrivalDate.toISOString().split('T')[0]} />
                </div>
                <div>
                    <Label className="text-right" htmlFor="departureDate">Fecha de salida</Label>
                    <Input id="departureDate" name="departureDate" type="date" required defaultValue={reservation?.departureDate.toISOString().split('T')[0]} />
                </div>
            </div>

            <DialogFooter className="flex flex-wrap justify-between pt-4 gap-4">
                <DialogClose asChild>
                    <Button type="button" variant="success">
                        <Icon action='undo' className="mr-2" />
                        Cancelar
                    </Button>
                </DialogClose>

                <DialogClose asChild>
                    <Button
                        type="submit"
                        variant="update"
                        onClick={() => {
                            toast({
                                title: "Reservación actualizada.",
                                description: "La reservación se actualizo correctamente.",
                            });
                        }}
                    >
                        <Icon action='save' className="mr-2" />
                        Actualizar
                    </Button>
                </DialogClose>
            </DialogFooter>
        </form>
    );
}

export default FormEditReservation;
