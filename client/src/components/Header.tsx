import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { Calendar, Search, Activity, Cpu } from "lucide-react";

export const Header: React.FC = () => {
  const { history, currentSearch } = useGlobal();

  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalSearches = history.filter(h => h.status === "completed").length;

  return (
    <header className="h-16 bg-[#131A2A]/40 backdrop-blur-md border-b border-[#1E293B] flex items-center justify-between px-6 z-10">
      {/* Informações da Esquerda */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium capitalize">{formattedDate}</span>
        </div>
        
        {currentSearch && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-900/30 text-[11px] text-blue-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Última busca: <span className="font-semibold text-white">"{currentSearch.keyword}"</span>
          </div>
        )}
      </div>

      {/* Informações da Direita (Métricas rápidas) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3.5 px-4 py-1.5 rounded-lg bg-[#131A2A] border border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Consultas:</span>
          </div>
          <span className="text-xs font-bold text-white font-mono">{totalSearches}</span>
        </div>

        <div className="flex items-center gap-3.5 px-4 py-1.5 rounded-lg bg-[#131A2A] border border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>SaaS Core:</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 font-mono">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
