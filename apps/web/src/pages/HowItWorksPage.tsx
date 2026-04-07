import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { SectionHeading } from "@/components/SectionHeading";
import { howItWorks, valueProps } from "@/data/content";

export function HowItWorksPage() {
  return (
    <div className="section-shell space-y-20 py-16">
      <SectionHeading
        eyebrow="Fluxo operacional"
        title="Do pedido ao atendimento concluído com poucas etapas e boa leitura de status."
        description="O sistema foi organizado para eliminar ruído na emergência: menos decisões, mais ação, com dashboards separados por papel."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {howItWorks.map((item, index) => (
          <Panel key={item} className="space-y-5">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-amber-400 text-sm font-semibold text-zinc-950">
              0{index + 1}
            </span>
            <p className="text-lg leading-8 text-zinc-100">{item}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {valueProps.map((item) => (
          <Panel key={item.title} className="space-y-4">
            <h3 className="font-display text-2xl text-white">{item.title}</h3>
            <p className="text-sm leading-7 text-zinc-400">{item.description}</p>
          </Panel>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <h3 className="font-display text-3xl text-white">Tudo pronto para um MVP validável hoje e um app robusto amanhã.</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          A arquitetura separa claramente front, API, autenticação, perfis e regras de negócio para que a evolução futura não exija recomeçar do zero.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="action-primary">
            Entrar na plataforma
          </Link>
          <Link to="/cadastro" className="action-secondary">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
