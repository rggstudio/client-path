import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
}

interface OverviewCardsProps {
  stats: StatCard[];
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatisticsCard key={index} stat={stat} />
      ))}
    </div>
  );
}

function StatisticsCard({ stat }: { stat: StatCard }) {
  return (
    <Card className="bg-white shadow-sm p-5 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
        </div>
        <div>
          <i className={`${stat.icon} text-lg text-black`}></i>
        </div>
      </div>
      
      {stat.change && (
        <div className={`mt-3 flex items-center text-xs font-medium ${stat.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <i className={`${stat.change.isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
          <span>{stat.change.value}</span>
          <span className="text-slate-500 ml-1">from last month</span>
        </div>
      )}
      
      {stat.subtitle && (
        <div className="mt-3 flex items-center text-xs font-medium text-slate-600">
          <span>{stat.subtitle}</span>
        </div>
      )}
    </Card>
  );
}

// Default dashboard statistics
export const getDashboardStats = (): StatCard[] => {
  return [
    {
      title: "Total Clients",
      value: 24,
      icon: "ri-user-line",
      iconBg: "",
      iconColor: "text-black",
      change: {
        value: "12% increase",
        isPositive: true
      }
    },
    {
      title: "Total Revenue",
      value: formatCurrency(12450),
      icon: "ri-money-dollar-circle-fill",
      iconBg: "",
      iconColor: "text-black",
      change: {
        value: "8% increase",
        isPositive: true
      }
    },
    {
      title: "Pending Invoices",
      value: 8,
      icon: "ri-file-list-line",
      iconBg: "",
      iconColor: "text-black",
      subtitle: "$4,320 outstanding"
    },
    {
      title: "Scheduled Meetings",
      value: 12,
      icon: "ri-calendar-2-line",
      iconBg: "",
      iconColor: "text-black",
      subtitle: "3 upcoming today"
    }
  ];
}
