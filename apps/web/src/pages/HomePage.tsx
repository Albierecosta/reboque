import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gauge,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MapPanel } from "@/components/MapPanel";
import { Panel } from "@/components/Panel";
import { SectionHeading } from "@/components/SectionHeading";
import { publicServices, valueProps } from "@/data/content";

export function HomePage() {
  return (
    <div className="pb-32">
      {/* Hero Section */}
      <section className="section-shell relative pt-16 sm:pt-24 lg:pt-32">
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_70%)]" />
        
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="relative z-10 flex flex-col items-start space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-300 shadow-premium backdrop-blur-md">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
              </span>
              Plataforma premium para socorro veicular
            </div>

            <div className="space-y-6">
              <h1 className="max-w-2xl font-display text-[40px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[64px] lg:text-[72px]">
                Encontre <span className="text-brand-400">reboque</span> em segundos<span className="text-brand-500">.</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-zinc-400 sm:text-xl">
                Altum conecta clientes e prestadores com despacho inteligente, ETA visual e uma experiência que parece produto global.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/solicitar" className="action-primary group px-8 py-4 text-base">
                Solicitar reboque agora
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/prestadores" className="action-secondary px-8 py-4 text-base">
                Sou prestador
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 text-sm font-medium text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-500" />
                Aceite em  2 min
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-500" />
                GPS em Tempo Real
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-500" />
                Pagamento Digital
              </div>
            </div>
          </div>

          {/* Right Side - Dashboard Style */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900/50 p-6 shadow-premium backdrop-blur-sm lg:p-8">
              <div className="hero-grid absolute inset-0 -z-10" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">Live Operations</h3>
                    <p className="mt-1 text-sm text-zinc-500">São Paulo, SP — Ativo agora</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-brand-500 text-[10px] font-bold text-white">
                      +12
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Ativos", value: "24", icon: <Users className="size-4" />, color: "text-brand-400" },
                    { label: "ETA Médio", value: "11m", icon: <Clock3 className="size-4" />, color: "text-blue-400" },
                    { label: "Online", value: "98%", icon: <RadioTower className="size-4" />, color: "text-brand-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <div className={stat.color}>{stat.icon}</div>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-inner">
                  <div className="absolute left-4 top-4 z-10">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 shadow-premium backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <div className="status-indicator">
                          <span className="status-indicator-dot"></span>
                          <span className="status-indicator-center"></span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-100">Broadcasting</span>
                      </div>
                    </div>
                  </div>
                  <MapPanel
                    center={[-23.5614, -46.6559]}
                    points={[
                      { id: "customer", position: [-23.5614, -46.6559], label: "Cliente", tone: "emerald" },
                      { id: "p1", position: [-23.5505, -46.6333], label: "Mendes 24h", tone: "sky" },
                    ]}
                    zoom={13}
                    className="h-full border-none"
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-premium">
                      <Zap className="size-3.5 fill-current" />
                      Pronto para aceite
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Sistema Verificado</p>
                    <p className="text-xs text-zinc-500">Transações protegidas por criptografia de ponta a ponta.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-shell mt-32 space-y-16 lg:mt-48">
        <SectionHeading
          eyebrow="Vantagens"
          title="Por que escolher a Altum?"
          description="Desenhamos o socorro veicular para o século XXI. Rapidez, transparência e confiança em um só lugar."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title} className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
                <Gauge className="size-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="section-shell mt-32 space-y-16 lg:mt-48">
        <SectionHeading
          eyebrow="Serviços"
          title="Tudo que você precisa"
          description="Cobertura completa para emergências urbanas e rodoviárias."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service) => (
            <Panel key={service.type} className="flex flex-col items-start">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-brand-400">
                <Wrench className="size-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{service.description}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-shell mt-32 lg:mt-48">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-brand-500 px-8 py-16 text-center shadow-premium lg:px-16 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="max-w-3xl font-display text-3xl font-bold text-white sm:text-5xl lg:text-6xl">
              Pronto para transformar sua operação de reboque?
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-brand-50 sm:text-xl">
              Junte-se a centenas de prestadores que já estão faturando mais com a plataforma líder em despacho inteligente.
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link to="/cadastro" className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-brand-600 shadow-premium transition-transform hover:scale-105 active:scale-95">
                Começar agora
              </Link>
              <Link to="/como-funciona" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95">
                Ver demonstração
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-shell mt-32 border-t border-white/10 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Wrench className="size-6 text-brand-500" />
              <span className="font-display text-2xl font-bold text-white">Reboque<span className="text-brand-500">.</span></span>
            </div>
            <p className="max-w-md text-zinc-500">
              A próxima geração do socorro veicular. Tecnologia de ponta para quem precisa de ajuda e para quem presta o serviço.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-zinc-500 lg:justify-end">
            <div className="flex items-center gap-2">
              <MapPinned className="size-4" />
              São Paulo, Brasil
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="size-4" />
              iOS & Android
            </div>
            <p>© 2026 Altum Sistemas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
