import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="lg:hidden bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            type="button" 
            className="p-2 rounded-md text-slate-500"
            onClick={toggleSidebar}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
          <div className="flex items-center">
            <span className="text-primary-600 font-bold text-xl">ClientPath</span>
          </div>
        </div>
        <div className="flex items-center">
          <button type="button" className="p-2 rounded-full bg-slate-100 text-slate-500">
            <i className="ri-notification-3-line text-lg"></i>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <span className="text-sm font-medium">{getUserInitials()}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/settings/account")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/settings/payment-reminders")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
