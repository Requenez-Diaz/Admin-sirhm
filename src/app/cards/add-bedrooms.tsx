import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddBedrooms() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                 <Button variant='success'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus mr-2">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Agregar habitación
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Registar habitaciones</DialogTitle>
                    <DialogDescription>
                        Esta seguro de resgistrar esta habitacion?
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                            Habitacion
                        </Label>
                        <Input id='name' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                            Temporada baja
                        </Label>
                        <Input id='username' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                            Temporada alta
                        </Label>
                        <Input id='username' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                            Estado
                        </Label>
                        <Input id='username' className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                            Tamaño
                        </Label>
                        <Input id='username' className='col-span-3' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='success'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            className="lucide lucide-undo-2 mr-2">
                            <path d="M9 14 4 9l5-5" />
                            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                        </svg>
                        Cancelar
                    </Button>
                    <Button type='submit' variant={"update"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            className="lucide lucide-save-all mr-2">
                            <path d="M10 2v3a1 1 0 0 0 1 1h5" />
                            <path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" />
                            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                            <path d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z" />
                        </svg>
                        Registrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
