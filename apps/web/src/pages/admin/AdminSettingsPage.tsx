import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";

export function AdminSettingsPage() {
  const { data, isLoading, error, reload } = useAsyncData(() => api.adminCategories(), []);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.adminCreateCategory({
      ...form,
      active: true,
    });
    setFeedback("Categoria criada com sucesso.");
    setForm({ name: "", slug: "", description: "" });
    await reload();
  }

  async function toggleCategory(id: string, active: boolean) {
    await api.adminUpdateCategory(id, { active });
    setFeedback("Categoria atualizada.");
    await reload();
  }

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando configurações...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar configurações."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configurações"
        title="Categorias e estrutura inicial"
        description="Administre os tipos de serviço já preparados para o MVP e futuras expansões."
      />
      {feedback ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Panel>
          <form className="space-y-4" onSubmit={handleCreate}>
            <h3 className="font-display text-2xl text-white">Nova categoria</h3>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Nome</label>
              <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Slug</label>
              <input className="field" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Descrição</label>
              <textarea className="field min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <button type="submit" className="action-primary">
              Criar categoria
            </button>
          </form>
        </Panel>

        <Panel>
          <h3 className="font-display text-2xl text-white">Categorias ativas</h3>
          <div className="mt-6 space-y-3">
            {data.map((category) => (
              <div key={category.id} className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{category.description}</p>
                </div>
                <button onClick={() => toggleCategory(category.id, !category.active)} className="action-secondary">
                  {category.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
