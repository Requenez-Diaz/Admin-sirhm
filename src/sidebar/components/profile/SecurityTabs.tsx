'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
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

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface SecurityTabProps {
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
}

export function SecurityTab({ onPasswordSubmit }: SecurityTabProps) {
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const accentText = 'text-blue-600';
  const inputFocusRing =
    'focus-visible:ring-blue-500 focus-visible:ring-2 focus-visible:ring-offset-2';
  const saveButtonClass =
    'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/50';
  const cancelButtonClass = 'bg-gray-500 hover:bg-gray-600 text-white';

  const handlePasswordChange = async (data: PasswordFormValues) => {
    await onPasswordSubmit(data);
    reset();
    setIsPasswordFormOpen(false);
  };

  return (
    <Card className="bg-white shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className={`text-2xl ${accentText}`}>
          Seguridad de la Cuenta
        </CardTitle>
        <CardDescription className="text-gray-600">
          Configura tu contraseña y autenticación de dos factores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-xl bg-gray-50`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className={`font-medium flex items-center gap-2 ${accentText}`}>
                <Lock className={`w-4 h-4 ${accentText}`} />
                Cambiar Contraseña
              </p>
              <p className="text-sm text-blue-700/80">
                Actualiza tu contraseña para mantener tu cuenta segura.
              </p>
            </div>

            <Button
              className={
                isPasswordFormOpen
                  ? cancelButtonClass
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
              onClick={() => {
                setIsPasswordFormOpen(!isPasswordFormOpen);
                if (isPasswordFormOpen) reset();
              }}
            >
              {isPasswordFormOpen ? 'Cancelar' : 'Cambiar'}
            </Button>
          </div>

          {isPasswordFormOpen && (
            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="space-y-4 pt-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="currentPassword" className={accentText}>
                  Contraseña Actual
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword')}
                  disabled={isSubmitting}
                  className={inputFocusRing}
                />
                {errors.currentPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword" className={accentText}>
                  Nueva Contraseña
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  disabled={isSubmitting}
                  className={inputFocusRing}
                />
                {errors.newPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword" className={accentText}>
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  {...register('confirmNewPassword')}
                  disabled={isSubmitting}
                  className={inputFocusRing}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={saveButtonClass}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-green-700 rounded-full animate-spin mr-2"></div>
                )}
                Establecer Nueva Contraseña
              </Button>
            </form>
          )}
        </div>

        <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
          <div>
            <p className={`font-medium ${accentText}`}>
              Autenticación de Dos Factores (2FA)
            </p>
            <p className="text-sm text-blue-700/80">
              Añade una capa extra de seguridad a tu cuenta.
            </p>
          </div>
          <Button
            variant="outline"
            disabled
            className="text-gray-400 border-gray-300"
          >
            Activar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
