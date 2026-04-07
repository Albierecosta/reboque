import { useEffect, useMemo, useState } from "react";
import { MapPanel } from "@/components/MapPanel";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { calculateDistanceKm, estimateArrivalMinutes, formatDistance } from "@/lib/geo";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, serviceTypeLabel, statusLabel } from "@/lib/format";
import { statusFlow } from "@/data/content";

export function TrackRequestPage() {
  const { data, isLoading, error, reload } = useAsyncData(() => api.customerRequests(), []);
  const [ratingScore, setRatingScore] = useState("5");
  const [ratingComment, setRatingComment] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      reload();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [reload]);

  const request = useMemo(
    () => data?.find((item) => !["completed", "cancelled"].includes(item.status)) ?? data?.[0] ?? null,
    [data],
  );

  const providerCoordinates = useMemo(() => {
    if (
      request?.provider?.providerProfile?.currentLatitude == null ||
      request?.provider?.providerProfile?.currentLongitude == null
    ) {
      return null;
    }

    return {
      latitude: request.provider.providerProfile.currentLatitude,
      longitude: request.provider.providerProfile.currentLongitude,
    };
  }, [request]);

  const liveDistanceKm = useMemo(() => {
    if (!providerCoordinates || !request) return null;
    return calculateDistanceKm(
      providerCoordinates.latitude,
      providerCoordinates.longitude,
      request.originLatitude,
      request.originLongitude,
    );
  }, [providerCoordinates, request]);

  const etaMinutes = useMemo(() => {
    if (!request) return null;
    if (request.status === "arrived" || request.status === "completed") return 0;
    return estimateArrivalMinutes(liveDistanceKm);
  }, [liveDistanceKm, request]);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando acompanhamento...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar dados."}</div>;
  if (!request) {
    return <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-300">Nenhum chamado encontrado para acompanhamento.</div>;
  }

  const activeRequest = request;

  async function handleCancel() {
    await api.cancelRequest(activeRequest.id);
    await reload();
  }

  async function handleRate() {
    await api.rateRequest(activeRequest.id, Number(ratingScore), ratingComment);
    setFeedback("Avaliação enviada com sucesso.");
    await reload();
  }

  const currentIndex = statusFlow.indexOf(activeRequest.status === "cancelled" ? "pending" : activeRequest.status);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Acompanhar solicitação"
        title={serviceTypeLabel[activeRequest.serviceType]}
        description="Veja a evolução do atendimento, dados do prestador e ações disponíveis para este chamado."
      />

      <Panel className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-400">Status atual</p>
            <h3 className="mt-2 font-display text-3xl text-white">{statusLabel[activeRequest.status]}</h3>
          </div>
          <StatusBadge status={activeRequest.status} />
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {statusFlow.map((status, index) => {
            const isActive = index <= currentIndex && activeRequest.status !== "cancelled";
            return (
              <div key={status} className={`rounded-[24px] border px-4 py-4 ${isActive ? "border-amber-300/30 bg-amber-400/10" : "border-white/10 bg-black/20"}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Etapa</p>
                <p className="mt-2 text-sm font-semibold text-white">{statusLabel[status]}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-400">Detalhes</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-200">
              <p>Origem: {activeRequest.originAddress}</p>
              <p>Destino: {activeRequest.destinationAddress}</p>
              <p>Contato: {activeRequest.contactPhone}</p>
              <p>Valor estimado: {formatCurrency(activeRequest.estimatedPrice)}</p>
              <p>Atualizado em: {formatDate(activeRequest.updatedAt)}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-400">Prestador responsável</p>
            {activeRequest.provider ? (
              <div className="mt-4 space-y-3 text-sm text-zinc-200">
                <p>{activeRequest.provider.providerProfile?.businessName ?? activeRequest.provider.name}</p>
                <p>{activeRequest.provider.phone}</p>
                <p>{activeRequest.provider.providerProfile?.vehicleType}</p>
                <p>{activeRequest.provider.providerProfile?.vehiclePlate}</p>
                <p>Distância atual: {formatDistance(liveDistanceKm)}</p>
                <p>Tempo estimado: {etaMinutes === 0 ? "Chegou ao local" : etaMinutes ? `${etaMinutes} min` : "Calculando..."}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-zinc-400">Aguardando o aceite de um prestador próximo.</p>
            )}
          </div>
        </div>

        <MapPanel
          center={[activeRequest.originLatitude, activeRequest.originLongitude]}
          connectPoints={Boolean(providerCoordinates)}
          points={[
            {
              id: "customer",
              position: [activeRequest.originLatitude, activeRequest.originLongitude],
              label: "Sua localização",
              tone: "amber",
            },
            ...(providerCoordinates
              ? [
                  {
                    id: "provider",
                    position: [providerCoordinates.latitude, providerCoordinates.longitude] as [number, number],
                    label: "Prestador em deslocamento",
                    tone: "sky" as const,
                  },
                ]
              : []),
          ]}
        />

        <p className="text-sm text-zinc-400">
          O mapa e a estimativa são atualizados automaticamente a cada poucos segundos com a posição mais recente do prestador.
        </p>

        {["pending", "broadcasting", "accepted"].includes(activeRequest.status) ? (
          <button onClick={handleCancel} className="action-secondary">
            Cancelar solicitação
          </button>
        ) : null}
      </Panel>

      {activeRequest.status === "completed" && !activeRequest.rating ? (
        <Panel className="space-y-4">
          <h3 className="font-display text-2xl text-white">Avalie o atendimento</h3>
          <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Nota</label>
              <select className="field" value={ratingScore} onChange={(event) => setRatingScore(event.target.value)}>
                {["5", "4", "3", "2", "1"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Comentário</label>
              <textarea className="field min-h-28" value={ratingComment} onChange={(event) => setRatingComment(event.target.value)} />
            </div>
          </div>
          {feedback ? <p className="text-sm text-emerald-200">{feedback}</p> : null}
          <button onClick={handleRate} className="action-primary">
            Enviar avaliação
          </button>
        </Panel>
      ) : null}
    </div>
  );
}
