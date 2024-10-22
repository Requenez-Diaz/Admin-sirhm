import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icons/icons";
import FormServices from "./formServices";

export function AddServices() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='success'>
                    <Icon action='plus' className="mr-2" />
                    Agregar
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Agregar un Servicio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de que desea agregar un Servicio?
                    </DialogDescription>
                </DialogHeader>
                <FormServices />
            </DialogContent>
        </Dialog>
    );
}
