export const serviceTypes = [
  "reboque",
  "pane_mecanica",
  "bateria_descarregada",
  "pneu_furado",
  "pane_seca",
  "chaveiro_automotivo",
  "outro",
] as const;

export const serviceRequestStatuses = [
  "pending",
  "broadcasting",
  "accepted",
  "on_the_way",
  "arrived",
  "completed",
  "cancelled",
] as const;

export const userRoles = ["customer", "provider", "admin"] as const;

export type ServiceType = (typeof serviceTypes)[number];
export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number];
export type UserRole = (typeof userRoles)[number];
