import { cx } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("max-w-3xl space-y-4", align === "center" && "mx-auto text-center")}>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-500">{eyebrow}</p>
      <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
      {description ? <p className="text-lg leading-relaxed text-zinc-500">{description}</p> : null}
    </div>
  );
}
