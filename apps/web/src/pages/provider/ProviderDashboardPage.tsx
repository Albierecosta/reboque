import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatDate, serviceTypeLabel } from "@/lib/format";

export function ProviderDashboardPage() {
  const { data, isLoading, error } = useAsyncData(() => api.providerDashboard(), []);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando operação do prestador...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar dashboard."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard do prestador"
        title={data.profile.businessName}
        description="Veja seu status operacional, chamados disponíveis e histórico recente sem navegar em excesso."
        action={<Link to="/app/prestador/chamados" className="action-primary">Ver chamados disponíveis</Link>}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricTile label="Status na rede" value={data.profile.isOnline ? "Online" : "Offline"} support={data.profile.isApproved ? "Cadastro aprovado" : "Aguardando aprovação"} />
        <MetricTile label="Raio de atendimento" value={`${data.profile.serviceRadiusKm} km`} support={`${data.profile.city}/${data.profile.state}`} />
        <MetricTile label="Chamados disponíveis" value={data.availableRequests.length} support="Ordenados por proximidade" />
        <MetricTile label="Histórico recente" value={data.recentHistory.length} support="Últimos atendimentos encerrados" />
      </div>

      {data.activeRequest ? (
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Chamado em andamento</p>
              <h3 className="mt-2 font-display text-3xl text-white">{serviceTypeLabel[data.activeRequest.serviceType]}</h3>
            </div>
            <StatusBadge status={data.activeRequest.status} />
          </div>
          <p className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-300">{data.activeRequest.problemDescription}</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Cliente</p>
              <p className="mt-2 text-sm text-zinc-200">{data.activeRequest.customer?.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Origem</p>
              <p className="mt-2 text-sm text-zinc-200">{data.activeRequest.originAddress}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Atualização</p>
              <p className="mt-2 text-sm text-zinc-200">{formatDate(data.activeRequest.updatedAt)}</p>
            </div>
          </div>
          <Link to="/app/prestador/ativo" className="action-secondary">
            Abrir atendimento ativo
          </Link>
        </Panel>
      ) : (
        <EmptyState title="Nenhum atendimento ativo" description="Seu painel está pronto para receber chamados assim que você estiver online e aprovado." />
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Chamados disponíveis</p>
              <h3 className="mt-2 font-display text-3xl text-white">Fila priorizada por proximidade</h3>
            </div>
            <Link to="/app/prestador/chamados" className="text-sm font-semibold text-amber-300">
              Abrir lista
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {data.availableRequests.slice(0, 4).map((request) => (
              <div key={request.id} className="flex flex-col gap-2 rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{serviceTypeLabel[request.serviceType]}</p>
                  <span className="text-sm text-amber-300">{request.distanceKm?.toFixed(1)} km</span>
                </div>
                <p className="text-sm text-zinc-400">{request.originAddress}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <p className="text-sm text-zinc-400">Alertas recentes</p>
          <div className="mt-6 space-y-3">
            {data.notifications.map((notification) => (
              <div key={notification.id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">{notification.title}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{notification.message}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
