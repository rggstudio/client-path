import { PageHeader } from "@/components/layout/page-header";
import { CalendarView } from "@/components/scheduling/calendar-view";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SchedulingPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Scheduling"
        subtitle="Manage and schedule meetings with your clients."
        actions={[
          {
            component: (
              <Button asChild>
                <Link href="/scheduling/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Link>
              </Button>
            )
          }
        ]}
      />
      <CalendarView />
    </div>
  );
}
