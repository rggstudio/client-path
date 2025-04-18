import { useSidebar } from "@/hooks/use-sidebar";

export function Header() {
  const { toggleSidebar } = useSidebar();

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
          <button type="button" className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <span className="text-sm font-medium">JS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
