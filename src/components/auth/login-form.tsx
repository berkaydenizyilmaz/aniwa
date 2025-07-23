"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./auth-card";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes.constants";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);

      const result = await signIn('credentials', {
        username: validatedData.username,
        password: validatedData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Kullanıcı adı veya şifre yanlış");
      } else {
        toast.success("Başarıyla giriş yaptınız!");
        router.push(ROUTES.PAGES.HOME);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AuthCard
      title="Giriş Yap"
      description="Hesabınıza giriş yapın"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.username ? "border-destructive" : ""}
            placeholder="Kullanıcı adınızı girin"
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.password ? "border-destructive" : ""}
            placeholder="Şifrenizi girin"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Şifremi unuttum
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Giriş Yap
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Kayıt ol
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}