"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { OffersTable } from "./tables/table";
import { OfferForm } from "./components";

export default function OffertsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Gestión de Ofertas</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className='flex items-center gap-2'
        >
          <PlusCircle className='h-4 w-4' />
          {showForm ? "Ver Listado" : "Crear Oferta"}
        </Button>
      </div>

      {showForm ? (
        <OfferForm onSuccess={() => setShowForm(false)} />
      ) : (
        <OffersTable />
      )}
    </div>
  );
}
