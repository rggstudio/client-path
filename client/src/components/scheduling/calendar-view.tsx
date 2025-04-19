import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Meeting {
  id: number;
  title: string;
  startDateTime: string;
  endDateTime: string;
  clientName: string;
  meetingType: string;
  status: string;
}

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "day">("month");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
    queryKey: ['/api/meetings'],
  });

  // Helper to get meetings for a specific date
  const getMeetingsForDate = (date: Date | undefined) => {
    if (!date || !meetings) return [];
    
    const dateString = format(date, 'yyyy-MM-dd');
    return meetings.filter(meeting => {
      const meetingDate = format(new Date(meeting.startDateTime), 'yyyy-MM-dd');
      return meetingDate === dateString;
    });
  };

  // Get meetings for the selected date
  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  // Handle month navigation
  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  // Calendar day renderer - add indicators for days with meetings
  const dayRenderer = (day: Date) => {
    if (!meetings) return null;
    
    const dateString = format(day, 'yyyy-MM-dd');
    const hasMeetings = meetings.some(meeting => {
      const meetingDate = format(new Date(meeting.startDateTime), 'yyyy-MM-dd');
      return meetingDate === dateString;
    });

    if (hasMeetings) {
      return <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mx-auto mt-1"></div>;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Calendar</CardTitle>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full rounded-none border-0"
              components={{
                DayContent: (props) => (
                  <div className="flex flex-col items-center">
                    <div>{props.date ? props.date.getDate() : ""}</div>
                    {props.date && dayRenderer(props.date)}
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Meetings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Failed to load meetings
              </div>
            ) : selectedDateMeetings.length > 0 ? (
              <div className="space-y-4">
                {selectedDateMeetings.map((meeting) => {
                  const startTime = format(new Date(meeting.startDateTime), 'h:mm a');
                  const endTime = format(new Date(meeting.endDateTime), 'h:mm a');
                  const statusColor = getStatusColor(meeting.status);
                  
                  return (
                    <div key={meeting.id} className="border rounded-md p-4 hover:bg-slate-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                          <p className="text-sm text-slate-500">Client: {meeting.clientName}</p>
                        </div>
                        <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <i className="ri-time-line"></i>
                          <span>{startTime} - {endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <i className="ri-map-pin-line"></i>
                          <span>{meeting.meetingType === 'in_person' ? 'In Person' : meeting.meetingType}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/scheduling/${meeting.id}`}>View Details</a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No meetings scheduled for {format(selectedDate || new Date(), 'MMMM d, yyyy')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
