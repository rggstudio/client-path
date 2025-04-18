import { PageHeader } from "@/components/layout/page-header";
import { SchedulingForm } from "@/components/scheduling/scheduling-form";

export default function CreateSchedulePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Schedule a Meeting"
        subtitle="Create a new meeting or appointment with your client."
        backLink="/scheduling"
      />
      <SchedulingForm />
    </div>
  );
}
