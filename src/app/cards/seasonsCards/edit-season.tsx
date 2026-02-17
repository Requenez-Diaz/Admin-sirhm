"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { FormSeason } from "./form-season";
import { updateSeason } from "@/app/actions/seasons/updateSeason";
import { SeasonType } from "@prisma/client";

interface EditSeasonProps {
    season: {
        id: number;
        nameSeason: SeasonType;
        dateStart: Date;
        dateEnd: Date;
    };
}

export function EditSeason({ season }: EditSeasonProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='sm' className='w-full justify-start gap-2'>
                    <Edit2 className='w-4 h-4' />
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Editar Temporada</DialogTitle>
                </DialogHeader>
                <FormSeason
                    saveAction={updateSeason}
                    initialData={season}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
