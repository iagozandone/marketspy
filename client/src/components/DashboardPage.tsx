import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardRankings } from "./DashboardRankings";
import { BarChart, Info, HelpCircle } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { currentSearch } = useGlobal();

  if (!currentSearch || currentSearch.status === "processing") {
    return null;
  }

  if (currentSearch.products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="border-t border-[#1E293B]/40 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <BarChart className="w-4 h-4 text-blue-500" />
            <span>Análises Estatísticas & Gráficos</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            <span>Atualizado dinamicamente</span>
          </div>
        </div>

        {/* Gráficos Analíticos */}
        <DashboardCharts search={currentSearch} />

        {/* Rankings Inteligentes */}
        <DashboardRankings search={currentSearch} />
      </div>
    </div>
  );
};
