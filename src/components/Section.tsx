import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section id={id} className="py-12 md:py-16">
      <div className="container-page space-y-8">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? (
            <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-dark)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {description ? (
            <p className="text-sm leading-7 text-[var(--muted-foreground)] md:text-base">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
