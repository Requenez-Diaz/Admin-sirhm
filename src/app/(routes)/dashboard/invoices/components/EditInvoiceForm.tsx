"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Trash2, Plus, Loader2 } from "lucide-react";
import { updateInvoice } from "@/app/actions/invoices/editInvoices";

export default function EditInvoiceForm({ invoice }: { invoice: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(invoice.clientId.toString());
  const [items, setItems] = useState(invoice.invoceDetails);

  const handleAddItem = () => {
    setItems([...items, { item: "", price: 0, amount: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const onSave = async () => {
    if (!clientId || items.length === 0)
      return toast.error("Datos incompletos");

    setLoading(true);
    const res = await updateInvoice(invoice.id, {
      clientId: parseInt(clientId),
      items,
    });

    if (res.success) {
      toast.success("Cambios guardados en C$");
      router.push("/dashboard/invoices");
      router.refresh();
    } else {
      toast.error("Error al actualizar");
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 bg-card p-6 border rounded-xl shadow-sm'>
      <div className='grid gap-2'>
        <label className='text-xs font-bold uppercase'>ID Cliente</label>
        <Input
          type='number'
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className='bg-background'
        />
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center border-b pb-2'>
          <h3 className='font-bold text-sm uppercase text-primary'>
            Detalle de Cargos
          </h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleAddItem}
          >
            <Plus className='h-4 w-4 mr-1' /> Añadir Fila
          </Button>
        </div>

        {items.map((item: any, index: number) => (
          <div
            key={index}
            className='flex flex-col md:flex-row gap-3 items-end bg-muted/30 p-3 rounded-lg border'
          >
            <div className='flex-[2] w-full'>
              <label className='text-[10px] uppercase font-bold text-muted-foreground'>
                Descripción
              </label>
              <Input
                value={item.item}
                onChange={(e) =>
                  handleUpdateItem(index, "item", e.target.value)
                }
                placeholder='Ej: Servicio de habitación'
              />
            </div>
            <div className='w-full md:w-32'>
              <label className='text-[10px] uppercase font-bold text-muted-foreground'>
                Precio C$
              </label>
              <Input
                type='number'
                value={item.price}
                onChange={(e) =>
                  handleUpdateItem(index, "price", parseFloat(e.target.value))
                }
              />
            </div>
            <div className='w-full md:w-20'>
              <label className='text-[10px] uppercase font-bold text-muted-foreground'>
                Cant.
              </label>
              <Input
                type='number'
                value={item.amount}
                onChange={(e) =>
                  handleUpdateItem(index, "amount", parseInt(e.target.value))
                }
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleRemoveItem(index)}
              className='text-red-500'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <div className='pt-4'>
        <Button
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold'
          variant={"success"}
          onClick={onSave}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className='animate-spin mr-2' />
          ) : (
            <Save className='mr-2 h-4 w-4' />
          )}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
