import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LayoutProvider } from "./providers/layout-provider";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/invoices" component={InvoicesPage} />
      <Route path="/invoices/create" component={CreateInvoicePage} />
      <Route path="/invoices/:id" component={InvoiceDetailsPage} />
      <Route path="/proposals" component={ProposalsPage} />
      <Route path="/proposals/create" component={CreateProposalPage} />
      <Route path="/proposals/:id" component={ProposalDetailsPage} />
      <Route path="/contracts" component={ContractsPage} />
      <Route path="/contracts/create" component={CreateContractPage} />
      <Route path="/contracts/:id" component={ContractDetailsPage} />
      <Route path="/scheduling" component={SchedulingPage} />
      <Route path="/scheduling/create" component={CreateSchedulePage} />
      <Route path="/client-portal" component={ClientPortalPage} />
      <Route path="/payments" component={PaymentsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LayoutProvider>
          <Toaster />
          <Router />
        </LayoutProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
