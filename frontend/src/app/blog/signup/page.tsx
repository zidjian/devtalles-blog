"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShinyText from "@/components/ShinyText";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  email: z.string().email("Dirección de correo electrónico inválida"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register: registerUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Redirigir si ya está autenticado - usando useEffect para evitar el error
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/blog");
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const success = await registerUser(
        data.email,
        data.password,
        data.nombre,
        data.apellidos,
        data.username
      );

      if (success) {
        setSuccess(true);
        // Redirigir después de un breve delay
        setTimeout(() => {
          router.push("/blog");
        }, 1500);
      } else {
        setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Verificando autenticación...</div>
      </div>
    );
  }

  // No mostrar el formulario si ya está autenticado (evita flash de contenido)
  if (isAuthenticated) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <>
      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md w-full">
          <div className="text-center mb-8">
            <ShinyText
              text="Crear Cuenta"
              className="text-4xl font-bold text-white mb-4"
            />
            <p className="text-lg text-white/80">
              Regístrate para acceder al blog
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ¡Cuenta creada exitosamente! Redirigiendo...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Nombre"
                  {...register("nombre")}
                  disabled={isLoading}
                />
                {errors.nombre?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Apellidos"
                  {...register("apellidos")}
                  disabled={isLoading}
                />
                {errors.apellidos?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apellidos.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Nombre de usuario"
                  {...register("username")}
                  disabled={isLoading}
                />
                {errors.username?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                {errors.password?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-white/60 mb-2">¿Ya tienes cuenta?</p>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                asChild
              >
                <a href="/blog/login">Iniciar Sesión</a>
              </Button>
            </div>

            <div className="text-center mt-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                asChild
              >
                <a href="/blog" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Volver al blog
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
