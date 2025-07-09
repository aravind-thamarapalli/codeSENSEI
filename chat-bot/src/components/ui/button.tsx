import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground hover:brightness-110 border border-primary/30 shadow-glass backdrop-blur-lg hover:shadow-glass-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive/90 backdrop-blur-lg text-destructive-foreground hover:bg-destructive border border-destructive/30 shadow-glass",
        outline:
          "border border-white/20 bg-white/[0.02] backdrop-blur-lg hover:bg-white/[0.05] hover:text-accent-foreground shadow-glass hover:border-white/30",
        secondary:
          "bg-secondary/90 backdrop-blur-lg text-secondary-foreground hover:bg-secondary border border-secondary/30 shadow-glass",
        ghost: "hover:bg-white/[0.05] backdrop-blur-lg hover:text-accent-foreground border border-transparent hover:border-white/10",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
