import { PageHeader } from "@/components/layout/page-header";
import { ContractList } from "@/components/contracts/contract-list";

export default function ContractsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Contracts"
        subtitle="Create and manage your client contracts."
      />
      <ContractList />
    </div>
  );
}
