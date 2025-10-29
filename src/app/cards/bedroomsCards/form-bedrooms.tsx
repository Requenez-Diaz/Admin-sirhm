"use client";
import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import ImageUpload from "./upload-file";
import { saveBedroomsWithUpload } from "@/app/actions/bedrooms/saveBedrooms";

type ActionState = { success: boolean; message: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? "Guardando..." : "Guardar Habitación"}
    </Button>
  );
}

export function FormBedrooms() {
  const [statusValue, setStatusValue] = useState("1");
  const [mimeType, setMimeType] = useState("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const initialState: ActionState = { success: false, message: "" };
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveBedroomsWithUpload,
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
      setStatusValue("1");
      setMimeType("");
      setFileName("");
      (
        document.getElementById("form-bedrooms") as HTMLFormElement | null
      )?.reset();
    }
  }, [state, toast]);

  return (
    <div className='w-full max-h-[85vh] overflow-y-auto px-4 sm:px-6 py-6'>
      <form
        id='form-bedrooms'
        action={formAction}
        className='container mx-auto max-w-4xl space-y-8'
      >
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-1'>
              Información Básica
            </h3>
            <p className='text-sm text-muted-foreground'>
              Detalles principales de la habitación
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='typeBedroom' className='text-base'>
              Tipo de Habitación
            </Label>
            <Input
              id='typeBedroom'
              name='typeBedroom'
              required
              placeholder='Ej: Suite Deluxe'
              className='h-11'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='text-base'>
              Descripción
            </Label>
            <Textarea
              id='description'
              name='description'
              required
              placeholder='Describe la habitación...'
              rows={5}
              className='resize-none'
            />
          </div>
        </div>

        <div className='border-t border-border' />

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-1'>
              Precios
            </h3>
            <p className='text-sm text-muted-foreground'>
              Configura los precios por temporada
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='lowSeasonPrice' className='text-base'>
                Precio Temporada Baja
              </Label>
              <Input
                id='lowSeasonPrice'
                name='lowSeasonPrice'
                type='number'
                required
                min='0'
                step='1'
                className='h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='highSeasonPrice' className='text-base'>
                Precio Temporada Alta
              </Label>
              <Input
                id='highSeasonPrice'
                name='highSeasonPrice'
                type='number'
                required
                min='0'
                step='1'
                className='h-11'
              />
            </div>
          </div>
        </div>

        <div className='border-t border-border' />

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-1'>
              Detalles
            </h3>
            <p className='text-sm text-muted-foreground'>
              Número y capacidad de la habitación
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='numberBedroom' className='text-base'>
                Número de Habitación
              </Label>
              <Input
                id='numberBedroom'
                name='numberBedroom'
                type='number'
                required
                min='1'
                className='h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='capacity' className='text-base'>
                Capacidad
              </Label>
              <Input
                id='capacity'
                name='capacity'
                type='number'
                required
                min='1'
                className='h-11'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-base'>Estado</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger className='h-11'>
                <SelectValue placeholder='Selecciona estado' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Activo</SelectItem>
                <SelectItem value='0'>Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <input type='hidden' name='status' value={statusValue} />
          </div>
        </div>

        <div className='border-t border-border' />

        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-1'>
              Imagen
            </h3>
            <p className='text-sm text-muted-foreground'>
              Sube una imagen de la habitación (solo vista previa)
            </p>
          </div>

          <div className='space-y-2'>
            <ImageUpload
              onImageUpload={({ mimeType, fileName }) => {
                setMimeType(mimeType);
                setFileName(fileName);
              }}
              onImageRemove={() => {
                setMimeType("");
                setFileName("");
              }}
            />
            <input type='hidden' name='mimeType' value={mimeType} />
            <input type='hidden' name='fileName' value={fileName} />
          </div>
        </div>

        <div className='pt-4 pb-2'>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
