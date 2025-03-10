import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Loader } from "./loader";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-gray-300 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        white:
          "bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-lg px-6",
        md: "h-10 rounded-lg px-6",
        icon: "h-9 w-9",
        xs: "h-6 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled,
      loading,
      children,
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonContent = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader className={cn("", size !== "icon" && "mr-2")} size={16} />
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {size === "icon" && !loading && <span>{children}</span>}
        {size !== "icon" && <span>{children}</span>}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel}>
          {buttonContent}
        </Link>
      );
    }

    return buttonContent;
  },
);
Button.displayName = "Button";

const DefaultButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, href, target, rel, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonContent = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel}>
          {buttonContent}
        </Link>
      );
    }

    return buttonContent;
  },
);
DefaultButton.displayName = "DefaultButton";

export { Button, buttonVariants, DefaultButton };
