import { PageHeader } from "@/components/layout/page-header";
import { ProposalList } from "@/components/proposals/proposal-list";

export default function ProposalsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Proposals"
        subtitle="Create and manage your client proposals."
      />
      <ProposalList />
    </div>
  );
}
