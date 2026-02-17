"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ActionState } from "@/app/actions/seasons/saveSeason";
import { SeasonType } from "@prisma/client";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type='submit' disabled={pending} className='w-full'>
            {pending ? "Guardando..." : isEditing ? "Actualizar Temporada" : "Guardar Temporada"}
        </Button>
    );
}

interface FormSeasonProps {
    saveAction: (
        _prevState: ActionState,
        formData: FormData
    ) => Promise<ActionState>;
    initialData?: {
        id?: number;
        nameSeason: SeasonType;
        dateStart: Date;
        dateEnd: Date;
    };
    onSuccess?: () => void;
}

export function FormSeason({ saveAction, initialData, onSuccess }: FormSeasonProps) {
    const { toast } = useToast();
    const [nameSeason, setNameSeason] = useState<SeasonType>(initialData?.nameSeason || "BAJA");

    const initialState: ActionState = { success: false, message: "" };
    const [state, formAction] = useFormState<ActionState, FormData>(
        saveAction,
        initialState
    );

    useEffect(() => {
        if (!state.message) return;
        toast({
            title: state.success ? "Éxito" : "Error",
            description: state.message,
            variant: state.success ? "default" : "destructive",
        });
        if (state.success) {
            if (onSuccess) onSuccess();
        }
    }, [state, toast, onSuccess]);

    return (
        <form action={formAction} className='space-y-6 py-4'>
            {initialData?.id && <input type='hidden' name='id' value={initialData.id} />}

            <div className='space-y-2'>
                <Label htmlFor='nameSeason'>Tipo de Temporada</Label>
                <Select
                    value={nameSeason}
                    onValueChange={(value) => setNameSeason(value as SeasonType)}
                    name="nameSeason"
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Selecciona temporada' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='ALTA'>Temporada Alta</SelectItem>
                        <SelectItem value='BAJA'>Temporada Baja</SelectItem>
                    </SelectContent>
                </Select>
                <input type="hidden" name="nameSeason" value={nameSeason} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='dateStart'>Fecha de Inicio</Label>
                    <Input
                        id='dateStart'
                        name='dateStart'
                        type='date'
                        required
                        defaultValue={initialData?.dateStart ? new Date(initialData.dateStart).toISOString().split('T')[0] : ""}
                    />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='dateEnd'>Fecha de Fin</Label>
                    <Input
                        id='dateEnd'
                        name='dateEnd'
                        type='date'
                        required
                        defaultValue={initialData?.dateEnd ? new Date(initialData.dateEnd).toISOString().split('T')[0] : ""}
                    />
                </div>
            </div>

            <SubmitButton isEditing={!!initialData?.id} />
        </form>
    );
}
