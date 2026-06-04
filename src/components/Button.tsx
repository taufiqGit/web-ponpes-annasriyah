import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
};

const styles = {
  primary: "bg-[var(--primary-dark)] text-white shadow-[0_14px_30px_rgba(47,126,90,0.22)] hover:-translate-y-0.5 hover:bg-[#286b4b]",
  secondary: "bg-white text-[var(--foreground)] ring-1 ring-[rgba(101,183,141,0.28)] hover:-translate-y-0.5 hover:bg-[var(--primary-soft)]",
  ghost: "bg-[var(--primary-soft)] text-[var(--primary-dark)] hover:-translate-y-0.5 hover:bg-[#dcefe2]",
};

export default function Button({ href, children, variant = "primary", external = false, className = "" }: ButtonProps) {
  const baseClass = `inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 ${styles[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={baseClass}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {children}
    </Link>
  );
}
