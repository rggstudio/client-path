import { PageHeader } from "@/components/layout/page-header";
import { ProposalForm } from "@/components/proposals/proposal-form";

export default function CreateProposalPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Create Proposal"
        subtitle="Create a new proposal for your client combining invoices and contracts."
        backLink="/proposals"
      />
      <ProposalForm />
    </div>
  );
}
