import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  ShieldAlert,
  ClipboardCheck,
  BarChart3,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  X,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/applications", icon: FileText, label: "Applications" },
  { to: "/documents", icon: FolderOpen, label: "Documents" },
  { to: "/risk", icon: ShieldAlert, label: "Risk" },
  { to: "/verification", icon: ClipboardCheck, label: "Verification" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/audit", icon: Clock, label: "Audit Trail" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ic_auth");
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white tracking-tight truncate">IntelliCredit</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">Credit Platform</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => onCollapse(!collapsed)}
            className="hidden lg:flex p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight
              className={cn("w-4 h-4 transition-transform duration-200", collapsed ? "" : "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn("sidebar-item", isActive ? "sidebar-item-active" : "sidebar-item-inactive")
            }
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-2 py-3 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-semibold text-white">
              PM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Priya Mehta</p>
              <p className="text-xs text-slate-400 truncate">Senior Credit Officer</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-semibold text-white">
              PM
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "mt-1 sidebar-item sidebar-item-inactive w-full",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="relative flex flex-col w-56 h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
