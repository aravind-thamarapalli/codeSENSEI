import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-lg",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/20 text-primary-foreground hover:bg-primary/30 shadow-glass",
        secondary:
          "border-secondary/30 bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 shadow-glass",
        destructive:
          "border-destructive/30 bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 shadow-glass",
        outline: "text-foreground border-white/20 bg-white/[0.02] hover:bg-white/[0.05] shadow-glass",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
