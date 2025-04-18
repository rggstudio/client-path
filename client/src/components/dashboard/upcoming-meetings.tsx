import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format, parse } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Meeting {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingType: string;
  meetingLink?: string;
}

export function UpcomingMeetings() {
  const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
    queryKey: ['/api/meetings/upcoming'],
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming Meetings</h2>
        <Button asChild variant="link" className="text-primary-600 hover:text-primary-700 p-0">
          <Link href="/scheduling">View Calendar</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-5 divide-y divide-slate-100">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary-100 text-primary-800 rounded-md p-2 text-center min-w-[60px]">
                  <Skeleton className="h-4 w-8 mx-auto mb-1" />
                  <Skeleton className="h-6 w-10 mx-auto" />
                </div>
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-36 mb-2" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="py-3 text-center text-sm text-red-500">
            Failed to load meetings
          </div>
        ) : meetings && meetings.length > 0 ? (
          meetings.map((meeting) => {
            const meetingDate = parse(meeting.date, 'yyyy-MM-dd', new Date());
            const month = format(meetingDate, 'MMM').toUpperCase();
            const day = format(meetingDate, 'd');
            
            return (
              <div key={meeting.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-100 text-primary-800 rounded-md p-2 text-center min-w-[60px]">
                    <div className="text-xs font-medium">{month}</div>
                    <div className="text-lg font-bold">{day}</div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{meeting.title}</h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <i className="ri-time-line mr-1"></i>
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {meeting.meetingType}
                      </span>
                      {meeting.meetingLink && (
                        <Button variant="link" size="sm" className="text-xs font-medium text-primary-600 p-0 h-auto">
                          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-3 text-center text-sm text-slate-500">
            No upcoming meetings
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock data for development
export const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: "Discovery Call with Alex Thompson",
    date: "2023-05-15",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    meetingType: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/123456789"
  },
  {
    id: 2,
    title: "Project Review with Sarah's Team",
    date: "2023-05-16",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    meetingType: "Google Meet",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: 3,
    title: "Proposal Discussion with David Co.",
    date: "2023-05-17",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    meetingType: "In Person"
  }
];
