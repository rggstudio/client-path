import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  buttonText: string;
  buttonColor: string;
  buttonHoverColor: string;
  path: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} action={action} />
        ))}
      </div>
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  return (
    <Card className="bg-white shadow-sm transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
      <CardHeader className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{action.title}</h3>
          <i className={`${action.icon} ${action.iconColor}`}></i>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <p className="text-sm text-slate-500 mb-4">{action.description}</p>
        <Button 
          asChild
          className={`w-full ${action.buttonColor} hover:${action.buttonHoverColor}`}
        >
          <Link href={action.path}>
            {action.buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Default quick actions
export function getQuickActions() {
  return [
    {
      title: "Create Invoice",
      description: "Create and send professional invoices to your clients.",
      icon: "ri-file-list-3-line",
      iconColor: "text-primary-600",
      buttonText: "Create Invoice",
      buttonColor: "bg-primary-600 text-white",
      buttonHoverColor: "bg-primary-700",
      path: "/invoices/create"
    },
    {
      title: "Send Proposal",
      description: "Create and send professional proposals to potential clients.",
      icon: "ri-file-paper-2-line",
      iconColor: "text-secondary-600",
      buttonText: "Create Proposal",
      buttonColor: "bg-secondary-600 text-white",
      buttonHoverColor: "bg-secondary-700",
      path: "/proposals/create"
    },
    {
      title: "Schedule Meeting",
      description: "Create booking links for clients to schedule meetings with you.",
      icon: "ri-calendar-line",
      iconColor: "text-blue-600",
      buttonText: "Schedule Meeting",
      buttonColor: "bg-blue-600 text-white",
      buttonHoverColor: "bg-blue-700",
      path: "/scheduling/create"
    }
  ];
}
