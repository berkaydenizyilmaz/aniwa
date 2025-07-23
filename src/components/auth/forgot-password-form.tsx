"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./auth-card";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Auth action çağrısı
      console.log("Forgot password attempt:", email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthCard 
        title="E-posta Gönderildi" 
        description="Şifre sıfırlama talimatları e-posta adresinize gönderildi"
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            E-posta kutunuzu kontrol edin ve şifre sıfırlama linkine tıklayın.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Şifremi Unuttum" 
      description="E-posta adresinizi girin, size şifre sıfırlama linki gönderelim"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            className={error ? "border-destructive" : ""}
            placeholder="E-posta adresinizi girin"
            required
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !email.trim()}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Şifre Sıfırlama Linki Gönder
        </Button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş sayfasına dön
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}