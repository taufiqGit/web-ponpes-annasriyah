type Step = {
  title: string;
  description: string;
};

export default function TimelineStepper({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="rounded-[28px] border border-[var(--line)] bg-white p-5 shadow-[0_18px_40px_rgba(35,86,58,0.08)]"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] font-bold text-[var(--primary-dark)]">
            0{index + 1}
          </div>
          <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
