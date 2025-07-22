import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground placeholder:font-semibold selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-16 w-full rounded-md border bg-background px-3 py-2 text-base text-foreground shadow-xs transition-all duration-200 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:bg-input focus-visible:border-ring focus-visible:border-2 focus-visible:ring-ring/10",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
