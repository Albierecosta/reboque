export type Role = "customer" | "provider" | "admin";

export type ServiceType =
  | "reboque"
  | "pane_mecanica"
  | "bateria_descarregada"
  | "pneu_furado"
  | "pane_seca"
  | "chaveiro_automotivo"
  | "outro";

export type ServiceStatus =
  | "pending"
  | "broadcasting"
  | "accepted"
  | "on_the_way"
  | "arrived"
  | "completed"
  | "cancelled";

export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type ProviderProfile = {
  id: string;
  userId: string;
  businessName: string;
  documentNumber: string;
  city: string;
  state: string;
  vehicleType: string;
  vehiclePlate: string;
  serviceRadiusKm: number;
  isOnline: boolean;
  isApproved: boolean;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  providerProfile?: ProviderProfile | null;
  notifications?: Notification[];
};

export type Rating = {
  id: string;
  score: number;
  comment?: string | null;
};

export type ServiceRequest = {
  id: string;
  customerId: string;
  providerId?: string | null;
  serviceType: ServiceType;
  problemDescription: string;
  originAddress: string;
  originLatitude: number;
  originLongitude: number;
  destinationAddress: string;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  contactPhone: string;
  status: ServiceStatus;
  estimatedPrice?: number | null;
  acceptedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  provider?: User | null;
  rating?: Rating | null;
  distanceKm?: number;
};

export type ServiceCategory = {
  id: string;
  name: string;
  slug: ServiceType;
  description?: string | null;
  active: boolean;
};
