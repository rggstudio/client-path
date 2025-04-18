import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatTimeAgo, getActivityIcon, getActivityIconColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: number;
  type: string;
  description: string;
  details: string;
  timestamp: string;
}

export function RecentActivities() {
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['/api/activities/recent'],
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
        <Button asChild variant="link" className="text-primary-600 hover:text-primary-700 p-0">
          <Link href="/activities">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-5">
        <div className="relative">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex space-x-4 pb-5">
                <div className="flex-shrink-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-56 mb-1" />
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center text-sm text-red-500 py-4">
              Failed to load activities
            </div>
          ) : activities && activities.length > 0 ? (
            activities.map((activity) => {
              const { bg, text } = getActivityIconColor(activity.type);
              const icon = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex space-x-4 pb-5 last:pb-0">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center`}>
                      <i className={`${icon} ${text}`}></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm text-slate-500 py-4">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for development
export const mockActivities: Activity[] = [
  {
    id: 1,
    type: "invoice_paid",
    description: "Invoice #INV-2023-42 has been paid",
    details: "Sarah Johnson paid $2,400.00",
    timestamp: "2023-05-15T14:30:00Z"
  },
  {
    id: 2,
    type: "contract_signed",
    description: "Contract signed with Michael Chen",
    details: "Logo Design Project",
    timestamp: "2023-05-15T11:45:00Z"
  },
  {
    id: 3,
    type: "proposal_sent",
    description: "Proposal sent to Emily Rodriguez",
    details: "Social Media Campaign",
    timestamp: "2023-05-14T16:20:00Z"
  },
  {
    id: 4,
    type: "meeting_scheduled",
    description: "New meeting scheduled with Alex Thompson",
    details: "Discovery Call",
    timestamp: "2023-05-14T09:15:00Z"
  }
];
