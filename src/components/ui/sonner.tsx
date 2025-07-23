"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group [&_*]:font-semibold"
      position="top-center"
      richColors
      duration={3000}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success)",
          "--success-text": "var(--foreground)",
          "--success-border": "var(--success)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--warning)",
          "--warning-text": "var(--foreground)",
          "--warning-border": "var(--warning)",
          "--info-bg": "var(--info)",
          "--info-text": "var(--foreground)",
          "--info-border": "var(--info)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
