import React from "react";
import { SearchHistoryEntry } from "../lib/mockData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Info } from "lucide-react";

interface DashboardChartsProps {
  search: SearchHistoryEntry;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ search }) => {
  const products = search.products;

  // 1. Dados para Catálogo vs Orgânico
  const catalogVsOrganicData = React.useMemo(() => {
    const catalog = products.filter(p => p.listing_type === "catalog").length;
    const organic = products.length - catalog;
    return [
      { name: "Catálogo", value: catalog, color: "#3B82F6" },
      { name: "Orgânico", value: organic, color: "#475569" }
    ];
  }, [products]);

  // 2. Dados para Full vs Standard
  const fullVsStandardData = React.useMemo(() => {
    const full = products.filter(p => p.logistics_type === "full").length;
    const standard = products.length - full;
    return [
      { name: "Full", value: full, color: "#10B981" },
      { name: "Standard", value: standard, color: "#64748B" }
    ];
  }, [products]);

  // 3. Dados para Distribuição de Preços (Histograma Simples)
  const priceDistributionData = React.useMemo(() => {
    if (products.length === 0) return [];
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const step = (max - min) / 5;

    const ranges = Array.from({ length: 5 }).map((_, i) => {
      const rangeStart = min + i * step;
      const rangeEnd = rangeStart + step;
      const count = prices.filter(p => p >= rangeStart && p < rangeEnd).length;
      return {
        range: `R$ ${Math.round(rangeStart)} - R$ ${Math.round(rangeEnd)}`,
        Quantidade: count
      };
    });
    return ranges;
  }, [products]);

  // 4. Top 5 Produtos mais visitados
  const mostVisitedData = React.useMemo(() => {
    return [...products]
      .sort((a, b) => b.visits_last_7_days - a.visits_last_7_days)
      .slice(0, 5)
      .map(p => ({
        title: p.title.substring(0, 20) + "...",
        Visitas: p.visits_last_7_days
      }));
  }, [products]);

  // 5. Top 5 Produtos por Vendas por Dia
  const topSalesData = React.useMemo(() => {
    return [...products]
      .sort((a, b) => b.sales_per_day - a.sales_per_day)
      .slice(0, 5)
      .map(p => ({
        title: p.title.substring(0, 20) + "...",
        Vendas: p.sales_per_day
      }));
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-8 text-center text-slate-500">
        Sem dados de produtos suficientes para renderizar os gráficos analíticos.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primeira Linha: Gráficos Circulares de Distribuição */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Catálogo vs Orgânico */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md flex flex-col justify-between">
          <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Canal: Catálogo vs Orgânico</h4>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catalogVsOrganicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {catalogVsOrganicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131A2A", borderColor: "#1E293B", borderRadius: "8px" }}
                  itemStyle={{ color: "#F8FAFC" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 shrink-0 pr-4">
              {catalogVsOrganicData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-slate-300 font-medium">{entry.name}: <strong>{entry.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full vs Standard */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md flex flex-col justify-between">
          <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Logística: Full vs Standard</h4>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fullVsStandardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fullVsStandardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131A2A", borderColor: "#1E293B", borderRadius: "8px" }}
                  itemStyle={{ color: "#F8FAFC" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 shrink-0 pr-4">
              {fullVsStandardData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-slate-300 font-medium">{entry.name}: <strong>{entry.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Linha: Distribuição de Preço */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md">
        <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Distribuição de Faixas de Preço</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#131A2A", borderColor: "#1E293B", borderRadius: "8px" }}
                labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
                itemStyle={{ color: "#3B82F6" }}
              />
              <Bar dataKey="Quantidade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terceira Linha: Rankings de Visitas e Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 5 Mais Visitados */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md">
          <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Top 5 Concorrentes Mais Visitados (7 dias)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostVisitedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis dataKey="title" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131A2A", borderColor: "#1E293B", borderRadius: "8px" }}
                  itemStyle={{ color: "#F59E0B" }}
                />
                <Bar dataKey="Visitas" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Vendas por Dia */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 shadow-md">
          <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Top 5 Concorrentes com Maior Giro (Vendas/Dia)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={topSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="title" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131A2A", borderColor: "#1E293B", borderRadius: "8px" }}
                  itemStyle={{ color: "#10B981" }}
                />
                <Area type="monotone" dataKey="Vendas" stroke="#10B981" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
