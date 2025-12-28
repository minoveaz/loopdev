import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../helpers/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-lpd-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lpd-brand-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-lpd-brand-primary text-lpd-text-onPrimary hover:brightness-110 shadow-lpd-sm",
        secondary: "bg-lpd-brand-secondary text-lpd-text-base hover:brightness-105 shadow-lpd-sm",
        outline: "border-2 border-lpd-brand-primary bg-transparent text-lpd-brand-primary hover:bg-lpd-brand-primary/5",
        ghost: "hover:bg-lpd-slate-100 text-lpd-text-base",
        link: "text-lpd-brand-primary underline-offset-4 hover:underline p-0 h-auto",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 min-w-[100px] px-6 py-2.5 rounded-lpd-md",
        sm: "h-9 min-w-[80px] px-3 py-1.5 rounded-lpd-sm text-lpd-xs",
        lg: "h-12 min-w-[120px] px-8 py-3.5 rounded-lpd-lg text-lpd-base",
        icon: "h-10 w-10 rounded-lpd-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
