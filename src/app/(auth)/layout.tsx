import { Header } from "@/components/layout/header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
} 