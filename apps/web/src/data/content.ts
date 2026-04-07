import type { Role, ServiceStatus, ServiceType } from "@/types";

export const publicServices: Array<{ type: ServiceType; title: string; description: string }> = [
  {
    type: "reboque",
    title: "Reboque",
    description: "Transporte rápido para oficina, casa ou local seguro.",
  },
  {
    type: "pane_mecanica",
    title: "Pane mecânica",
    description: "Primeiro suporte para falhas inesperadas em rota.",
  },
  {
    type: "bateria_descarregada",
    title: "Bateria descarregada",
    description: "Partida auxiliar e atendimento no local.",
  },
  {
    type: "pneu_furado",
    title: "Pneu furado",
    description: "Troca de pneu e apoio emergencial.",
  },
  {
    type: "pane_seca",
    title: "Pane seca",
    description: "Suporte para falta de combustível com agilidade.",
  },
  {
    type: "chaveiro_automotivo",
    title: "Chaveiro automotivo",
    description: "Acesso ao veículo e assistência com travas e chaves.",
  },
];

export const valueProps = [
  {
    title: "Despacho geolocalizado",
    description: "A plataforma localiza prestadores online, aprovados e mais próximos em segundos.",
  },
  {
    title: "Operação clara para o cliente",
    description: "Pedido simples, atualização de status e acompanhamento do atendimento sem ruído.",
  },
  {
    title: "Painel profissional para prestadores",
    description: "Chamados disponíveis, aceite rápido e gestão de perfil pronta para escalar.",
  },
];

export const howItWorks = [
  "O cliente envia a ocorrência com localização, origem, destino e telefone.",
  "A plataforma ordena prestadores aprovados e online por proximidade.",
  "O primeiro prestador a aceitar assume o atendimento e atualiza o status até a conclusão.",
];

export const faqs = [
  {
    question: "Como os prestadores são selecionados?",
    answer: "O sistema considera localização atual, raio de atendimento, aprovação cadastral e disponibilidade online.",
  },
  {
    question: "Funciona em múltiplas cidades?",
    answer: "Sim. A modelagem foi pensada para crescer por região, cidade e operação multi-base.",
  },
  {
    question: "Já está pronto para WhatsApp e pagamentos?",
    answer: "O MVP já deixa o backend organizado para evoluir com notificações, integrações e cobrança online.",
  },
];

export const statusFlow: ServiceStatus[] = [
  "pending",
  "broadcasting",
  "accepted",
  "on_the_way",
  "arrived",
  "completed",
];

export const portalLabels: Record<Role, { eyebrow: string; headline: string; support: string }> = {
  customer: {
    eyebrow: "Cliente",
    headline: "Ajuda rápida sem fricção",
    support: "Solicite atendimento, acompanhe o status e avalie o serviço em poucos passos.",
  },
  provider: {
    eyebrow: "Prestador",
    headline: "Operação ágil para quem atende na rua",
    support: "Aceite chamados, atualize o atendimento e mantenha sua cobertura ativa por região.",
  },
  admin: {
    eyebrow: "Administrador",
    headline: "Controle da operação em tempo real",
    support: "Acompanhe prestadores, chamados, categorias e regiões em uma base pronta para crescer.",
  },
};
