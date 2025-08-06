// src/components/ui/gaming/button.tsx
import { Button } from "../button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export const GamingButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-text",
      outline: "border-2 border-gaming-accent text-gaming-accent hover:bg-gaming-accent/10",
      ghost: "bg-gaming-card hover:bg-gaming-card-hover text-gaming-text",
    }

    return (
      <Button
        className={cn(
          "transition-all duration-300",
          "shadow-neon hover:shadow-neon-hover",
          variants[variant as keyof typeof variants],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GamingButton.displayName = "GamingButton"