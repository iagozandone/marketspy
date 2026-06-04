import React, { useState } from "react";
import { SearchHistoryEntry, Product } from "../lib/mockData";
import { 
  TrendingUp, 
  Award, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CalendarDays,
  Coins,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardRankingsProps {
  search: SearchHistoryEntry;
}

export const DashboardRankings: React.FC<DashboardRankingsProps> = ({ search }) => {
  const products = search.products;
  const [activeRanking, setActiveTab] = useState<
    "most_visited" | "best_sales" | "lowest_price" | "highest_price" | "newest" | "oldest"
  >("best_sales");

  const sortedRankings = React.useMemo(() => {
    const list = [...products];
    switch (activeRanking) {
      case "most_visited":
        return list.sort((a, b) => b.visits_last_7_days - a.visits_last_7_days).slice(0, 10);
      case "best_sales":
        return list.sort((a, b) => b.sales_per_day - a.sales_per_day).slice(0, 10);
      case "lowest_price":
        return list.sort((a, b) => a.price - b.price).slice(0, 10);
      case "highest_price":
        return list.sort((a, b) => b.price - a.price).slice(0, 10);
      case "newest":
        return list.sort((a, b) => a.days_online - b.days_online).slice(0, 10);
      case "oldest":
        return list.sort((a, b) => b.days_online - a.days_online).slice(0, 10);
      default:
        return list.slice(0, 10);
    }
  }, [products, activeRanking]);

  const tabs = [
    { id: "best_sales", label: "Giro de Vendas", icon: TrendingUp },
    { id: "most_visited", label: "Mais Visitados", icon: Eye },
    { id: "lowest_price", label: "Menores Preços", icon: ArrowDownRight },
    { id: "highest_price", label: "Maiores Preços", icon: ArrowUpRight },
    { id: "newest", label: "Anúncios Recentes", icon: Sparkles },
    { id: "oldest", label: "Anúncios Antigos", icon: CalendarDays },
  ] as const;

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md space-y-5">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-bold tracking-wide text-slate-200 uppercase">Rankings Inteligentes (Top 10)</h4>
      </div>

      {/* Botões de Seleção do Ranking */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRanking === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border",
                isActive 
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10" 
                  : "bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:text-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Lista do Ranking */}
      <div className="space-y-2.5">
        {sortedRankings.map((product, index) => {
          const rank = index + 1;
          return (
            <div 
              key={product.id}
              className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B0F19] border border-[#1E293B]/60 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Badge de Posição */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-extrabold shrink-0",
                  rank === 1 ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" :
                  rank === 2 ? "bg-slate-300/15 text-slate-300 border border-slate-300/30" :
                  rank === 3 ? "bg-amber-700/15 text-amber-600 border border-amber-700/30" :
                  "bg-slate-900 text-slate-500"
                )}>
                  {rank}
                </div>

                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-10 h-10 rounded-md border border-[#1E293B] object-cover shrink-0 bg-slate-900"
                />

                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-200 truncate max-w-[250px] sm:max-w-[400px]">
                    {product.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{product.seller_name}</p>
                </div>
              </div>

              {/* Métrica de Valor / Relevância dependendo do Ranking */}
              <div className="flex items-center gap-5 shrink-0 pl-4">
                <div className="text-right">
                  {activeRanking === "best_sales" && (
                    <span className="text-xs font-bold text-emerald-400 font-mono">{product.sales_per_day} vendas/dia</span>
                  )}
                  {activeRanking === "most_visited" && (
                    <span className="text-xs font-bold text-amber-400 font-mono">{product.visits_last_7_days.toLocaleString("pt-BR")} visitas</span>
                  )}
                  {(activeRanking === "lowest_price" || activeRanking === "highest_price") && (
                    <span className="text-xs font-bold text-white font-mono">R$ {product.price.toLocaleString("pt-BR")}</span>
                  )}
                  {(activeRanking === "newest" || activeRanking === "oldest") && (
                    <span className="text-xs font-bold text-slate-300 font-mono">{product.days_online} dias no ar</span>
                  )}
                </div>

                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-[#1A2333] text-slate-500 hover:text-white transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
