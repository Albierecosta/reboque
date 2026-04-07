import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatDate, serviceTypeLabel } from "@/lib/format";

export function ProviderHistoryPage() {
  const { data, isLoading, error } = useAsyncData(() => api.providerHistory(), []);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando histórico do prestador...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar histórico."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Histórico"
        title="Atendimentos finalizados e anteriores"
        description="Visualize cliente, tipo de serviço, data e status de cada atendimento realizado."
      />
      <div className="space-y-4">
        {data.map((request) => (
          <Panel key={request.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-display text-2xl text-white">{serviceTypeLabel[request.serviceType]}</h3>
                <p className="mt-2 text-sm text-zinc-400">{request.customer?.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{request.originAddress}</p>
              </div>
              <div className="space-y-2 text-sm text-zinc-300 lg:text-right">
                <StatusBadge status={request.status} />
                <p>{formatDate(request.updatedAt)}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
