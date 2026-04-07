import { ArrowRight, CheckCircle2, GaugeCircle, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { SectionHeading } from "@/components/SectionHeading";

export function ProviderLandingPage() {
  return (
    <div className="section-shell space-y-16 py-16">
      <SectionHeading
        eyebrow="Quero ser prestador"
        title="Entre em uma plataforma com cara de operação séria e aceite chamados próximos sem complicação."
        description="Cadastro profissional, raio de atendimento, painel com chamados disponíveis e aprovação administrativa para manter confiança na rede."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: <Truck className="size-5" />, title: "Perfil operacional", text: "Empresa, documento, veículo, placa e raio de cobertura já estruturados no cadastro." },
          { icon: <GaugeCircle className="size-5" />, title: "Aceite rápido", text: "Os chamados chegam priorizados por proximidade para reduzir tempo de resposta." },
          { icon: <ShieldCheck className="size-5" />, title: "Aprovação com governança", text: "O admin acompanha aprovação, regiões e performance para manter qualidade da base." },
        ].map((item) => (
          <Panel key={item.title} className="space-y-5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">{item.icon}</div>
            <h3 className="font-display text-2xl text-white">{item.title}</h3>
            <p className="text-sm leading-7 text-zinc-400">{item.text}</p>
          </Panel>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Painel do prestador
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Histórico de atendimentos
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Atualização de status
          </span>
        </div>
        <h3 className="mt-6 font-display text-4xl text-white">Capacidade de crescer com você, não contra sua operação.</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          A base do MVP já comporta múltiplas cidades, notificações futuras, pagamentos e expansão para aplicativo mobile sem refazer o coração do sistema.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/cadastro" className="action-primary">
            Criar conta de prestador
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/login" className="action-secondary">
            Entrar como prestador
          </Link>
        </div>
      </div>
    </div>
  );
}
