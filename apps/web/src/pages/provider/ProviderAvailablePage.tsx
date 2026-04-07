import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, serviceTypeLabel } from "@/lib/format";

export function ProviderAvailablePage() {
  const { data, isLoading, error, reload } = useAsyncData(() => api.providerAvailableRequests(), []);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAccept(requestId: string) {
    await api.providerAcceptRequest(requestId);
    setFeedback("Chamado aceito com sucesso.");
    await reload();
  }

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando fila de chamados...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar chamados."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chamados disponíveis"
        title="Ocorrências próximas para aceite rápido"
        description="A lista considera seu raio de atendimento, localização atual e status online."
      />
      {feedback ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}</p> : null}
      <div className="space-y-4">
        {data.map((request) => (
          <Panel key={request.id}>
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-3xl text-white">{serviceTypeLabel[request.serviceType]}</h3>
                  <StatusBadge status={request.status} />
                </div>
                <p className="text-sm leading-7 text-zinc-400">{request.problemDescription}</p>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
                  <span>{request.originAddress}</span>
                  <span>{request.distanceKm?.toFixed(1)} km</span>
                  <span>{formatCurrency(request.estimatedPrice)}</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => handleAccept(request.id)} className="action-primary">
                Aceitar chamado
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
