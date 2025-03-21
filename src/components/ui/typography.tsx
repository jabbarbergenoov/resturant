import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  children: ReactNode;
  className?: string;
}

export function Typography({ variant, children, className }: TypographyProps) {
  switch (variant) {
    case "h1":
      return <h1 className={cn("text-4xl font-bold", className)}>{children}</h1>;
    case "h2":
      return <h2 className={cn("text-3xl font-bold", className)}>{children}</h2>;
    case "h3":
      return <h3 className={cn("text-2xl font-bold", className)}>{children}</h3>;
    case "h4":
      return <h4 className={cn("text-xl font-bold", className)}>{children}</h4>;
    case "p":
      return <p className={cn("text-base", className)}>{children}</p>;
    case "span":
      return <span className={cn("text-sm", className)}>{children}</span>;
    default:
      return <p className={cn("text-base", className)}>{children}</p>;
  }
}