import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-primary transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-[#FFD700]/50 focus-visible:border-[#FFD700] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default: "bg-[#FFD700] text-[#0b0c0d] shadow-xs hover:bg-[#e6c200]",
        destructive:
          "bg-[#dc2626] text-white shadow-xs hover:bg-[#b91c1c] focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "border border-[#2a2a2a] bg-[#0b0c0d] text-white shadow-xs hover:bg-[#1a1a1a]",
        secondary: "bg-[#1a1a1a] text-white shadow-xs hover:bg-[#2a2a2a]",
        ghost: "hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-[#2a2a2a]",
        link: "text-[#FFD700] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
