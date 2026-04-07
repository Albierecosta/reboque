import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAuth } from "@/context/AuthContext";

export function CustomerProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil"
        title="Sua conta"
        description="Dados principais, notificações recentes e visão rápida da sua experiência na plataforma."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricTile label="Perfil" value="Cliente" support="Permissão de abertura e acompanhamento de chamados" />
        <MetricTile label="Notificações" value={user?.notifications?.length ?? 0} support="Últimos avisos carregados pelo backend" />
        <MetricTile label="Contato" value={user?.phone ?? "-"} support="Número usado nos atendimentos" />
      </div>

      <Panel>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-400">Nome</p>
            <p className="mt-2 text-lg text-white">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">E-mail</p>
            <p className="mt-2 text-lg text-white">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Telefone</p>
            <p className="mt-2 text-lg text-white">{user?.phone}</p>
          </div>
        </div>
      </Panel>

      <Panel>
        <p className="text-sm text-zinc-400">Notificações recentes</p>
        <div className="mt-6 space-y-3">
          {(user?.notifications ?? []).map((notification) => (
            <div key={notification.id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="font-semibold text-white">{notification.title}</p>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{notification.message}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
