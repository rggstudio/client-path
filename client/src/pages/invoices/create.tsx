import { PageHeader } from "@/components/layout/page-header";
import { InvoiceForm } from "@/components/invoices/invoice-form";

export default function CreateInvoicePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Create Invoice"
        subtitle="Create a new invoice for your client."
        backLink="/invoices"
      />
      <InvoiceForm />
    </div>
  );
}
