import { PageHeader } from "@/components/layout/page-header";
import { ContractForm } from "@/components/contracts/contract-form";

export default function CreateContractPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Create Contract"
        subtitle="Create a new legally binding contract for your client."
        backLink="/contracts"
      />
      <ContractForm />
    </div>
  );
}
