"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Configuraciones de Perfil</CardTitle>
            <CardDescription>
              Administra tu información personal y preferencias de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  placeholder='Tu nombre'
                  defaultValue={session?.user?.name || ""}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Correo Electrónico</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='tu@email.com'
                  defaultValue={session?.user?.email || ""}
                  disabled
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <Input id='password' type='password' placeholder='••••••••' />
              </div>

              <div className='pt-4'>
                <Button className='w-full'>Guardar Cambios</Button>
              </div>
            </div>

            <div className='border-t pt-4'>
              <h3 className='text-lg font-medium mb-4'>Preferencias</h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='notifications'>
                    Notificaciones por correo
                  </Label>
                  <Input
                    id='notifications'
                    type='checkbox'
                    className='h-4 w-4'
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='newsletter'>Boletín informativo</Label>
                  <Input id='newsletter' type='checkbox' className='h-4 w-4' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
