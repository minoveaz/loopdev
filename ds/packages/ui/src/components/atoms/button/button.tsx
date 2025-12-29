import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "../../../helpers/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--lpd-color-brand-primary)]/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-[var(--lpd-color-brand-primary)] text-white shadow-lg shadow-[var(--lpd-color-brand-primary)]/30 hover:brightness-110",
        secondary: "bg-[var(--lpd-color-bg-base)] border border-[var(--lpd-color-border-subtle)] text-[var(--lpd-color-text-base)] hover:bg-[var(--lpd-color-bg-subtle)] hover:border-[var(--lpd-color-text-muted)]/30 shadow-sm",
        outline: "border-2 border-[var(--lpd-color-brand-primary)] bg-transparent text-[var(--lpd-color-brand-primary)] hover:bg-[var(--lpd-color-brand-primary)]/5",
        ghost: "text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-brand-primary)] hover:bg-[var(--lpd-color-brand-primary)]/5",
        tertiary: "text-[var(--lpd-color-brand-primary)] hover:bg-[var(--lpd-color-brand-primary)]/5 p-0 h-auto",
        energy: "bg-[var(--lpd-color-brand-secondary)] text-[var(--lpd-color-slate-900)] shadow-lg shadow-[var(--lpd-color-brand-secondary)]/30 hover:brightness-105",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
      },
      size: {
        default: "h-10 px-5 rounded-lg",
        sm: "h-9 px-3 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg bg-[var(--lpd-color-bg-subtle)] text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-brand-primary)] hover:bg-[var(--lpd-color-bg-base)] border border-transparent hover:border-[var(--lpd-color-border-subtle)]",
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
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        <span className="leading-none">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }