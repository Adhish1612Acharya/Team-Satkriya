import { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: "primary" | "secondary" | "outline";
  icon?: ElementType;
  fullWidth?: boolean;
  className?: string;
  [key: string]: any;
}

export default ButtonProps;
