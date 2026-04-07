import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { roleLabel } from "@/lib/format";

export function AdminUsersPage() {
  const { data, isLoading, error } = useAsyncData(() => api.adminUsers(), []);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando usuários...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar usuários."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Usuários" title="Base cadastrada" description="Consulta rápida de clientes, prestadores e administradores." />
      <Panel className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.3fr_1.2fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.24em] text-zinc-500">
          <span>Nome</span>
          <span>E-mail</span>
          <span>Papel</span>
          <span>Telefone</span>
        </div>
        {data.map((user) => (
          <div key={user.id} className="grid grid-cols-[1.3fr_1.2fr_1fr_1fr] gap-4 border-b border-white/5 px-6 py-4 text-sm text-zinc-200 last:border-b-0">
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{roleLabel[user.role]}</span>
            <span>{user.phone}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
