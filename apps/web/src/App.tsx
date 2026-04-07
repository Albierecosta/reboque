import { Navigate, Route, Routes } from "react-router-dom";
import { PortalLayout } from "@/components/PortalLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/components/PublicLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminMetricsPage } from "@/pages/admin/AdminMetricsPage";
import { AdminProvidersPage } from "@/pages/admin/AdminProvidersPage";
import { AdminRequestsPage } from "@/pages/admin/AdminRequestsPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProviderLandingPage } from "@/pages/ProviderLandingPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RequestLandingPage } from "@/pages/RequestLandingPage";
import { CustomerDashboardPage } from "@/pages/customer/CustomerDashboardPage";
import { CustomerHistoryPage } from "@/pages/customer/CustomerHistoryPage";
import { CustomerProfilePage } from "@/pages/customer/CustomerProfilePage";
import { NewRequestPage } from "@/pages/customer/NewRequestPage";
import { TrackRequestPage } from "@/pages/customer/TrackRequestPage";
import { ProviderActivePage } from "@/pages/provider/ProviderActivePage";
import { ProviderAvailablePage } from "@/pages/provider/ProviderAvailablePage";
import { ProviderDashboardPage } from "@/pages/provider/ProviderDashboardPage";
import { ProviderHistoryPage } from "@/pages/provider/ProviderHistoryPage";
import { ProviderProfilePage } from "@/pages/provider/ProviderProfilePage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/como-funciona" element={<HowItWorksPage />} />
        <Route path="/solicitar" element={<RequestLandingPage />} />
        <Route path="/prestadores" element={<ProviderLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["customer"]} />}>
        <Route path="/app/cliente" element={<PortalLayout role="customer" />}>
          <Route index element={<CustomerDashboardPage />} />
          <Route path="nova-solicitacao" element={<NewRequestPage />} />
          <Route path="acompanhar" element={<TrackRequestPage />} />
          <Route path="historico" element={<CustomerHistoryPage />} />
          <Route path="perfil" element={<CustomerProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["provider"]} />}>
        <Route path="/app/prestador" element={<PortalLayout role="provider" />}>
          <Route index element={<ProviderDashboardPage />} />
          <Route path="chamados" element={<ProviderAvailablePage />} />
          <Route path="ativo" element={<ProviderActivePage />} />
          <Route path="historico" element={<ProviderHistoryPage />} />
          <Route path="perfil" element={<ProviderProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/app/admin" element={<PortalLayout role="admin" />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="prestadores" element={<AdminProvidersPage />} />
          <Route path="chamados" element={<AdminRequestsPage />} />
          <Route path="metricas" element={<AdminMetricsPage />} />
          <Route path="configuracoes" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="/app" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
