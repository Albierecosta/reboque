import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatDate, serviceTypeLabel } from "@/lib/format";

export function AdminRequestsPage() {
  const { data, isLoading, error } = useAsyncData(() => api.adminRequests(), []);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando chamados...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar chamados."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Chamados" title="Gestão completa da operação" description="Acompanhe status, cliente, prestador vinculado e dados do atendimento." />
      <div className="space-y-4">
        {data.map((request) => (
          <Panel key={request.id}>
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-3xl text-white">{serviceTypeLabel[request.serviceType]}</h3>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Cliente: {request.customer?.name} • Prestador: {request.provider?.providerProfile?.businessName ?? "Não atribuído"}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{request.originAddress}</p>
              </div>
              <div className="text-sm text-zinc-400 xl:text-right">
                <p>Criado em {formatDate(request.createdAt)}</p>
                <p className="mt-1">Atualizado em {formatDate(request.updatedAt)}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
