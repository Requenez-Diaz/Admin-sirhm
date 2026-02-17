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
import { Plus } from "lucide-react";
import { FormSeason } from "./form-season";
import { saveSeason } from "@/app/actions/seasons/saveSeason";

export function AddSeason() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='gap-2'>
                    <Plus className='w-4 h-4' />
                    Agregar Temporada
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Nueva Temporada</DialogTitle>
                </DialogHeader>
                <FormSeason
                    saveAction={saveSeason}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
