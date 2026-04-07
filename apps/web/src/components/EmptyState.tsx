import { LifeBuoy } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-black/20 p-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-amber-300">
        <LifeBuoy className="size-6" />
      </div>
      <h3 className="mt-5 font-display text-2xl text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}
