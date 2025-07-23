"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./auth-card";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Şifre eşleşme kontrolü
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Şifreler eşleşmiyor" });
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Auth action çağrısı
      console.log("Reset password attempt:", { token, password: formData.password });
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors({ general: "Bir hata oluştu. Lütfen tekrar deneyin." });
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

  if (isSuccess) {
    return (
      <AuthCard 
        title="Şifre Sıfırlandı" 
        description="Şifreniz başarıyla güncellendi"
      >
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <p className="text-sm text-muted-foreground">
            Artık yeni şifrenizle giriş yapabilirsiniz.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Şifre Sıfırla" 
      description="Yeni şifrenizi belirleyin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Yeni Şifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.password ? "border-destructive" : ""}
            placeholder="Yeni şifrenizi girin"
            required
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.confirmPassword ? "border-destructive" : ""}
            placeholder="Şifrenizi tekrar girin"
            required
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !formData.password || !formData.confirmPassword}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Şifreyi Güncelle
        </Button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}