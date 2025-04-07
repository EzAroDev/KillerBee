import { cn } from "@/lib/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "font-primary text-[#f1f1f1] placeholder:text-[#777] bg-[#141516] border border-[#2a2a2a] rounded-md",
        "flex h-9 w-full min-w-0 px-3 py-1 text-sm shadow-xs transition-all outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[#FFD700]/50 focus-visible:border-[#FFD700]",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
