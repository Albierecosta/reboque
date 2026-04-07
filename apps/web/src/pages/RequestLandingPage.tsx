import { ArrowRight, Clock3, LocateFixed, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { SectionHeading } from "@/components/SectionHeading";

export function RequestLandingPage() {
  return (
    <div className="section-shell space-y-16 py-16">
      <SectionHeading
        eyebrow="Solicitar atendimento"
        title="Peça ajuda com poucos campos e deixe o sistema encontrar quem pode te atender mais rápido."
        description="O fluxo foi desenhado para quem está sob pressão: localização atual, tipo do problema, origem, destino e telefone. Só isso."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: <LocateFixed className="size-5" />, title: "Sua localização atual", text: "Captura geográfica para busca inteligente de prestadores próximos." },
          { icon: <PhoneCall className="size-5" />, title: "Contato direto", text: "Telefone salvo no chamado para acelerar a operação em campo." },
          { icon: <Clock3 className="size-5" />, title: "Acompanhamento simples", text: "Status claros do pedido desde a transmissão até a conclusão." },
        ].map((item) => (
          <Panel key={item.title} className="space-y-5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">{item.icon}</div>
            <h3 className="font-display text-2xl text-white">{item.title}</h3>
            <p className="text-sm leading-7 text-zinc-400">{item.text}</p>
          </Panel>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.15),rgba(255,255,255,0.03))] p-8">
        <h3 className="font-display text-4xl text-white">Precisa validar a experiência completa?</h3>
        <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-200">
          Entre com sua conta ou crie um cadastro para registrar um atendimento real dentro da plataforma.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="action-primary">
            Entrar e pedir atendimento
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/cadastro" className="action-secondary">
            Criar conta de cliente
          </Link>
        </div>
      </div>
    </div>
  );
}
