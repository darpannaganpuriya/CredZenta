import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronRight, Menu, HelpCircle } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  applications: "Applications",
  documents: "Documents",
  risk: "Risk",
  verification: "Verification",
  reports: "Reports",
  audit: "Audit Trail",
  settings: "Settings",
  create: "New Application",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const crumbs = pathSegments.map((seg, i) => ({
    label: breadcrumbMap[seg] || seg,
    path: "/" + pathSegments.slice(0, i + 1).join("/"),
    isLast: i === pathSegments.length - 1,
  }));

  const pageTitle = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : "Dashboard";

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 z-10">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title & Breadcrumb */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-900 truncate">{pageTitle}</h1>
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
          <span>CredZenta</span>
          {crumbs.map((crumb) => (
            <span key={crumb.path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <span className={crumb.isLast ? "text-slate-600 font-medium" : "text-slate-400"}>
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus-within:border-brand-400 focus-within:bg-white transition-colors">
        <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
        />
        <kbd className="hidden lg:inline-flex text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell className="w-4.5 h-4.5 w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="ml-1 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-semibold text-white cursor-pointer">
          PM
        </div>
      </div>
    </header>
  );
}
