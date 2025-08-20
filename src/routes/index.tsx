import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useLogin, useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

const formSchema = z.object({
  username: z.string().max(150),
  password: z.string().max(150)
})

function App() {
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/private' });
    }
  }, [isAuthenticated, navigate]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success('¡Inicio de sesión exitoso!');
        navigate({ to: '/private' });
      },
      onError: () => {
        toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      },
    });
  }

  return (
    <div className="p-5 text-center h-dvh items-center flex justify-center ">

      <Card className='max-w-lg w-sm'>
        <CardHeader>
          <h2 className="text-lg font-medium">Iniciar Sesión</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Iniciando...' : 'Iniciar'}
              </Button>
            </form>
          </Form>

        </CardContent>

      </Card>
    </div>
  )
}
