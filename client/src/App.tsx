import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LayoutProvider } from "./providers/layout-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Dashboard from "@/pages/dashboard";
import InvoicesPage from "@/pages/invoices/index";
import CreateInvoicePage from "@/pages/invoices/create";
import InvoiceDetailsPage from "@/pages/invoices/[id]";
import ProposalsPage from "@/pages/proposals/index";
import CreateProposalPage from "@/pages/proposals/create";
import ProposalDetailsPage from "@/pages/proposals/[id]";
import ContractsPage from "@/pages/contracts/index";
import CreateContractPage from "@/pages/contracts/create";
import ContractDetailsPage from "@/pages/contracts/[id]";
import SchedulingPage from "@/pages/scheduling/index";
import CreateSchedulePage from "@/pages/scheduling/create";
import ClientPortalPage from "@/pages/client-portal/index";
import PaymentsPage from "@/pages/payments/index";
import ClientsPage from "@/pages/clients/index";
import CreateClientPage from "@/pages/clients/create";
import PaymentRemindersPage from "@/pages/settings/payment-reminders";
import TeamPage from "@/pages/team/index";
import AccountSettingsPage from "@/pages/settings/account/index";
import ClientDetailsPage from "@/pages/clients/[id]";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/invoices" component={InvoicesPage} />
      <ProtectedRoute path="/invoices/create" component={CreateInvoicePage} />
      <ProtectedRoute path="/invoices/:id" component={InvoiceDetailsPage} />
      <ProtectedRoute path="/proposals" component={ProposalsPage} />
      <ProtectedRoute path="/proposals/create" component={CreateProposalPage} />
      <ProtectedRoute path="/proposals/:id" component={ProposalDetailsPage} />
      <ProtectedRoute path="/contracts" component={ContractsPage} />
      <ProtectedRoute path="/contracts/create" component={CreateContractPage} />
      <ProtectedRoute path="/contracts/:id" component={ContractDetailsPage} />
      <ProtectedRoute path="/scheduling" component={SchedulingPage} />
      <ProtectedRoute path="/scheduling/create" component={CreateSchedulePage} />
      <ProtectedRoute path="/client-portal" component={ClientPortalPage} />
      <ProtectedRoute path="/payments" component={PaymentsPage} />
      <ProtectedRoute path="/clients" component={ClientsPage} />
      <ProtectedRoute path="/clients/create" component={CreateClientPage} />
      <ProtectedRoute path="/clients/:id" component={ClientDetailsPage} />
      <ProtectedRoute path="/team" component={TeamPage} />
      <ProtectedRoute path="/settings/payment-reminders" component={PaymentRemindersPage} />
      <ProtectedRoute path="/settings/account" component={AccountSettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <LayoutProvider>
            <Toaster />
            <Router />
          </LayoutProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
