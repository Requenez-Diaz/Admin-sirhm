'use client';

import { useForm } from 'react-hook-form';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ProfileFormValues {
  username: string;
  email: string;
}

interface GeneralTabProps {
  defaultProfile: ProfileFormValues;
  isEditing: boolean;
  onEditToggle: () => void;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
}

export function GeneralTab({
  defaultProfile,
  isEditing,
  onEditToggle,
  onSubmit,
  onCancel
}: GeneralTabProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    defaultValues: defaultProfile
  });

  const editCancelEditButtonClass = isEditing
    ? 'bg-gray-500 hover:bg-gray-600 text-white shadow-md shadow-gray-500/50'
    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/50';

  const saveButtonClass =
    'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/50';

  const discardButtonClass =
    'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/50';

  return (
    <Card className="bg-white shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-700">
          Información de la Cuenta
        </CardTitle>
        <CardDescription className="text-gray-600">
          Actualiza tu nombre, correo electrónico y teléfono.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-blue-700">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                {...register('username')}
                disabled={!isEditing || isSubmitting}
                className="transition-all focus-visible:ring-blue-500 focus-visible:ring-2 focus-visible:ring-offset-2"
              />
              {errors.username && (
                <p className="text-red-600 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-blue-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                {...register('email')}
                disabled={!isEditing || isSubmitting}
                type="email"
                className="transition-all focus-visible:ring-blue-500 focus-visible:ring-2 focus-visible:ring-offset-2"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <Button
              type="button"
              className={editCancelEditButtonClass}
              onClick={onEditToggle}
              disabled={isSubmitting}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
            </Button>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  className={discardButtonClass}
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Descartar
                </Button>

                <Button
                  type="submit"
                  className={saveButtonClass}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-green-700 rounded-full animate-spin mr-2"></div>
                  ) : null}
                  Guardar Cambios
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
