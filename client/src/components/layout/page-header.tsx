import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

interface PageAction {
  label?: string;
  icon?: string;
  variant?: "default" | "outline" | "primary" | "secondary";
  onClick?: () => void;
  component?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  actions?: PageAction[];
}

export function PageHeader({ title, subtitle, backLink, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div className="flex flex-col">
        {backLink && (
          <Button 
            asChild 
            variant="link" 
            className="text-slate-500 p-0 mb-2 w-fit"
          >
            <Link href={backLink}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      
      {actions && actions.length > 0 && (
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          {actions.map((action, index) => {
            if (action.component) {
              return <div key={index}>{action.component}</div>;
            }
            
            const variant = action.variant === "primary" ? "default" : action.variant || "outline";
            
            return (
              <Button 
                key={index} 
                variant={variant} 
                onClick={action.onClick}
              >
                {action.icon && <i className={`${action.icon} mr-2`}></i>}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
