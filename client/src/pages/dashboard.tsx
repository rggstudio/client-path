import { PageHeader } from "@/components/layout/page-header";
import { OverviewCards, getDashboardStats } from "@/components/dashboard/overview-cards";
import { QuickActions, getQuickActions } from "@/components/dashboard/quick-actions";
import { LatestInvoices, mockInvoices } from "@/components/dashboard/latest-invoices";
import { UpcomingMeetings, mockMeetings } from "@/components/dashboard/upcoming-meetings";
import { RecentActivities, mockActivities } from "@/components/dashboard/recent-activities";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  // Fetch overview stats
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });
  
  // Fetch latest invoices
  const { data: invoices } = useQuery({
    queryKey: ['/api/invoices/latest'],
  });
  
  // Fetch upcoming meetings
  const { data: meetings } = useQuery({
    queryKey: ['/api/meetings/upcoming'],
  });
  
  // Fetch recent activities
  const { data: activities } = useQuery({
    queryKey: ['/api/activities/recent'],
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, John! Here's what's happening."
        actions={[
          { label: "Export", icon: "ri-download-2-line", variant: "outline", onClick: () => {} },
          { label: "New Client", icon: "ri-add-line", variant: "primary", onClick: () => {} }
        ]}
      />

      {/* Overview Cards */}
      <OverviewCards stats={stats || getDashboardStats()} />

      {/* Quick Actions */}
      <QuickActions actions={getQuickActions()} />

      {/* Latest Invoices */}
      <LatestInvoices />

      {/* Upcoming Meetings and Recent Activities Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingMeetings />
        <RecentActivities />
      </div>
    </div>
  );
}
