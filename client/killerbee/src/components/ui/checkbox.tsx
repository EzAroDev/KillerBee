"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "font-primary size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none",
        "bg-[#141516] border-[#2a2a2a] text-[#FFD700]",
        "data-[state=checked]:bg-[#FFD700] data-[state=checked]:text-[#0b0c0d] data-[state=checked]:border-[#FFD700]",
        "focus-visible:ring-[3px] focus-visible:ring-[#FFD700]/50 focus-visible:border-[#FFD700]",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
