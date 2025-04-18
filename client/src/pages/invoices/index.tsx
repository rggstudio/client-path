import { PageHeader } from "@/components/layout/page-header";
import { InvoiceList } from "@/components/invoices/invoice-list";

export default function InvoicesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Invoices"
        subtitle="Create and manage your client invoices."
      />
      <InvoiceList />
    </div>
  );
}
