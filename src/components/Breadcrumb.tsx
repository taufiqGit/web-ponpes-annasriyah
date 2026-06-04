import Link from "next/link";

type Item = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav className="mb-6 text-sm text-[var(--muted-foreground)]" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[var(--primary-dark)]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-[var(--foreground)]" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
