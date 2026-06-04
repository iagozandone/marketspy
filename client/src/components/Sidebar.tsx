import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { 
  BarChart3, 
  Star, 
  History, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Activity,
  Sparkles,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useGlobal();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { name: "Busca e Análise", icon: BarChart3 },
    { name: "Favoritos", icon: Star },
    { name: "Histórico", icon: History },
    { name: "Exportações", icon: FileSpreadsheet },
  ];

  const handleFutureFeature = (featureName: string) => {
    toast.info(`Módulo "${featureName}" é uma funcionalidade futura planejada (Desktop/SaaS).`, {
      description: "Será integrada na versão completa via Playwright/API.",
    });
  };

  return (
    <aside 
      className={cn(
        "bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-screen transition-all duration-300 relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#1E293B] justify-between overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              MARKET<span className="text-blue-500">SPY</span>
            </span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className={cn("px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase", collapsed && "sr-only")}>
          Módulos Principais
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#1A2333] text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5" 
                  : "text-slate-400 hover:bg-[#131A2A] hover:text-white"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-105", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
              {!collapsed && <span>{item.name}</span>}
              {isActive && !collapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow" />
              )}
            </button>
          );
        })}

        {/* Futuras Funcionalidades */}
        <div className={cn("px-3 pt-6 mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase", collapsed && "sr-only")}>
          Monitoramento Inteligente
        </div>
        {!collapsed ? (
          <div className="space-y-1">
            <button 
              onClick={() => handleFutureFeature("Monitoramento de Preços")}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-md text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-[#131A2A]/50 transition-all"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                Rastreamento Diário
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/30">BREVE</span>
            </button>
            <button 
              onClick={() => handleFutureFeature("Detector de Vencedores")}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-md text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-[#131A2A]/50 transition-all"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                Detector de Vencedores
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/30">BREVE</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-2">
            <Activity className="w-4 h-4 text-slate-600 hover:text-slate-400 cursor-pointer" onClick={() => handleFutureFeature("Rastreamento Diário")} />
            <Sparkles className="w-4 h-4 text-slate-600 hover:text-slate-400 cursor-pointer" onClick={() => handleFutureFeature("Detector de Vencedores")} />
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#1E293B] overflow-hidden">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800/30 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-400">ML</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">Pesquisa Privada</p>
                <p className="text-[10px] text-slate-500 truncate">Modo Local Activo</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 bg-[#131A2A] p-2 rounded border border-[#1E293B]">
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-amber-500" /> Versão Beta</span>
              <span className="font-mono">v1.0.0</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800/30 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">ML</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-[#131A2A] border border-[#1E293B] hover:bg-[#1A2333] text-slate-400 hover:text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-30"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
};
