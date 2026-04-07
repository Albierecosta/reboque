import { useEffect, useState, type FormEvent } from "react";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapPanel } from "@/components/MapPanel";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAuth } from "@/context/AuthContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { api } from "@/lib/api";

const saoPauloCenter = {
  latitude: -23.5614,
  longitude: -46.6559,
};

export function NewRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories } = useAsyncData(() => api.categories(), []);
  const {
    coordinates,
    requestLocation,
    isLocating,
    isTracking,
    startTracking,
    stopTracking,
    error: locationError,
  } = useGeolocation(saoPauloCenter);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    serviceType: "reboque",
    problemDescription: "",
    originAddress: "",
    destinationAddress: "",
    contactPhone: user?.phone ?? "",
    destinationLatitude: String(saoPauloCenter.latitude),
    destinationLongitude: String(saoPauloCenter.longitude),
  });

  useEffect(() => {
    requestLocation();
    startTracking();

    return () => stopTracking();
  }, [requestLocation, startTracking, stopTracking]);

  useEffect(() => {
    if (!user?.phone) {
      return;
    }

    setForm((current) => (current.contactPhone ? current : { ...current, contactPhone: user.phone }));
  }, [user?.phone]);

  function validateForm() {
    if (form.problemDescription.trim().length < 5) {
      return "Descreva o problema com pelo menos 5 caracteres.";
    }

    if (form.originAddress.trim().length < 5) {
      return "Informe um endereco de origem com pelo menos 5 caracteres.";
    }

    if (form.destinationAddress.trim().length < 5) {
      return "Informe um endereco de destino com pelo menos 5 caracteres.";
    }

    if (form.contactPhone.trim().length < 8) {
      return "Informe um telefone de contato valido.";
    }

    if (Number.isNaN(Number(form.destinationLatitude)) || Number.isNaN(Number(form.destinationLongitude))) {
      return "As coordenadas de destino precisam ser numericas.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.createRequest({
        ...form,
        problemDescription: form.problemDescription.trim(),
        originAddress: form.originAddress.trim(),
        destinationAddress: form.destinationAddress.trim(),
        contactPhone: form.contactPhone.trim(),
        originLatitude: coordinates?.latitude ?? saoPauloCenter.latitude,
        originLongitude: coordinates?.longitude ?? saoPauloCenter.longitude,
        destinationLatitude: Number(form.destinationLatitude),
        destinationLongitude: Number(form.destinationLongitude),
      });

      setSuccess(`Solicitação enviada com sucesso. ${result.matchedProviders.length} prestadores próximos foram encontrados.`);
      navigate("/app/cliente/acompanhar");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao criar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nova solicitação"
        title="Abra um atendimento em poucos passos."
        description="A plataforma usa sua posição atual para priorizar prestadores online, aprovados e dentro do raio configurado."
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-400">Localização atual</p>
                <p className="mt-1 text-sm text-zinc-200">
                  {coordinates ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}` : "Usando ponto padrão da demonstração"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {coordinates?.accuracy ? `Precisão aproximada: ${Math.round(coordinates.accuracy)} m` : "Aguardando precisão do GPS"}
                </p>
              </div>
              <button type="button" onClick={() => requestLocation()} className="action-secondary !px-4 !py-2">
                <LocateFixed className="size-4" />
                {isLocating ? "Localizando..." : isTracking ? "GPS ativo" : "Atualizar localização"}
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Tipo de serviço</label>
              <select className="field" value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })}>
                {(categories ?? []).map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Descreva o problema</label>
              <textarea className="field min-h-28" required minLength={5} value={form.problemDescription} onChange={(event) => setForm({ ...form, problemDescription: event.target.value })} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Endereço de origem</label>
              <input className="field" required minLength={5} value={form.originAddress} onChange={(event) => setForm({ ...form, originAddress: event.target.value })} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Endereço de destino</label>
              <input className="field" required minLength={5} value={form.destinationAddress} onChange={(event) => setForm({ ...form, destinationAddress: event.target.value })} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm text-zinc-300">Telefone</label>
                <input className="field" type="tel" required minLength={8} value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Lat. destino</label>
                <input className="field" type="number" step="any" value={form.destinationLatitude} onChange={(event) => setForm({ ...form, destinationLatitude: event.target.value })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Long. destino</label>
                <input className="field" type="number" step="any" value={form.destinationLongitude} onChange={(event) => setForm({ ...form, destinationLongitude: event.target.value })} />
              </div>
            </div>

            {locationError ? <p className="text-sm text-amber-200">{locationError}</p> : null}
            {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
            {success ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}

            <button type="submit" disabled={isSubmitting} className="action-primary w-full">
              {isSubmitting ? "Enviando solicitação..." : "Solicitar atendimento"}
            </button>
          </form>
        </Panel>

        <div className="space-y-4">
          <MapPanel
            center={[coordinates?.latitude ?? saoPauloCenter.latitude, coordinates?.longitude ?? saoPauloCenter.longitude]}
            points={[
              {
                id: "origin",
                position: [coordinates?.latitude ?? saoPauloCenter.latitude, coordinates?.longitude ?? saoPauloCenter.longitude],
                label: "Sua localização atual",
                tone: "amber",
              },
            ]}
          />
          <Panel>
            <p className="text-sm text-zinc-400">Como o despacho funciona</p>
            <ol className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
              <li>1. O chamado salva origem, destino, telefone e categoria.</li>
              <li>2. O GPS do seu celular define a origem exata para buscar prestadores próximos.</li>
              <li>3. O primeiro aceite bloqueia o atendimento e libera o acompanhamento da chegada.</li>
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}
