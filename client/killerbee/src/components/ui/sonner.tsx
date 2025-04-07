"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#141516",
          "--normal-text": "#f1f1f1",
          "--normal-border": "#FFD700",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
