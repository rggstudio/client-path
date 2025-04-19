import { PageHeader } from "@/components/layout/page-header";
import { OverviewCards, getDashboardStats } from "@/components/dashboard/overview-cards";
import { QuickActions, getQuickActions } from "@/components/dashboard/quick-actions";
import { LatestInvoices, mockInvoices } from "@/components/dashboard/latest-invoices";
import { UpcomingMeetings, mockMeetings } from "@/components/dashboard/upcoming-meetings";
import { RecentActivities, mockActivities } from "@/components/dashboard/recent-activities";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  // Fetch overview stats
  const { data: stats } = useQuery<any[]>({
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
          { 
            component: (
              <a href="/clients/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                <i className="ri-add-line mr-2"></i>
                New Client
              </a>
            )
          },
          { 
            component: (
              <button onClick={() => window.print()} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
                <i className="ri-download-2-line mr-2"></i>
                Export
              </button>
            )
          }
        ]}
      />

      {/* Overview Cards */}
      <OverviewCards stats={stats as any[] || getDashboardStats()} />

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
