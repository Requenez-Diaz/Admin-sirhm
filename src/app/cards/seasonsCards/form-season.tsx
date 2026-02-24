"use client";

import React, { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type='submit' disabled={pending} className='w-full' variant='default'>
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
    existingSeasons?: any[];
}

export function FormSeason({ saveAction, initialData, onSuccess, existingSeasons }: FormSeasonProps) {
    const { toast } = useToast();
    const [nameSeason, setNameSeason] = useState<SeasonType>(initialData?.nameSeason || "BAJA");

    const [dateRange, setDateRange] = useState<{ from: Date | undefined | null; to: Date | undefined | null }>(
        () => ({
            from: initialData?.dateStart ? new Date(initialData.dateStart) : undefined,
            to: initialData?.dateEnd ? new Date(initialData.dateEnd) : undefined,
        })
    );

    const [disabledRanges, setDisabledRanges] = useState<Array<{ from: Date; to: Date }>>([]);

    const initialState: ActionState = { success: false, message: "" };
    const [state, formAction] = React.useActionState<ActionState, FormData>(saveAction, initialState);

    // use server-provided seasons to mark disabled ranges in calendar
    useEffect(() => {
        if (!existingSeasons) return;
        const ranges = existingSeasons
            .filter((s: any) => !(initialData && s.id === initialData.id))
            .map((s: any) => ({ from: new Date(s.dateStart), to: new Date(s.dateEnd) }));
        setDisabledRanges(ranges);
    }, [existingSeasons, initialData]);

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

    // keep hidden inputs in sync
    useEffect(() => {
        const startInput = document.querySelector('input[name="dateStart"]') as HTMLInputElement | null;
        const endInput = document.querySelector('input[name="dateEnd"]') as HTMLInputElement | null;
        if (startInput) startInput.value = dateRange.from ? new Date(dateRange.from).toISOString().split('T')[0] : '';
        if (endInput) endInput.value = dateRange.to ? new Date(dateRange.to).toISOString().split('T')[0] : '';
    }, [dateRange]);

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

            <div className='space-y-2'>
                <Label>Rango de Fechas</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'} className={'w-full justify-start text-left font-normal'}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {dateRange.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "P", { locale: es })} - {format(dateRange.to, "P", { locale: es })}
                                    </>
                                ) : (
                                    format(dateRange.from, "P", { locale: es })
                                )
                            ) : (
                                <span>Selecciona un rango de fechas</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                            mode='range'
                            selected={dateRange as any}
                            onSelect={(range: any) => setDateRange(range ?? { from: undefined, to: undefined })}
                            disabled={disabledRanges}
                            locale={es}
                        />
                    </PopoverContent>
                </Popover>

                {/* Hidden inputs to submit with the formAction */}
                <input name='dateStart' type='hidden' />
                <input name='dateEnd' type='hidden' />
            </div>

            <div className='pt-4'>
                <SubmitButton isEditing={!!initialData?.id} />
            </div>
        </form>
    );
}
