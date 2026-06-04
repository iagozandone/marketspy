import React from "react";
import { SearchHistoryEntry } from "../lib/mockData";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShieldCheck, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from "lucide-react";

interface SearchDetailsProps {
  search: SearchHistoryEntry;
}

export const SearchDetails: React.FC<SearchDetailsProps> = ({ search }) => {
  const products = search.products;

  // Cálculos estatísticos avançados
  const stats = React.useMemo(() => {
    if (products.length === 0) return null;

    const prices = products.map(p => p.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((acc, p) => acc + p, 0) / products.length;

    const salesPerDay = products.map(p => p.sales_per_day);
    const averageSalesPerDay = salesPerDay.reduce((acc, s) => acc + s, 0) / products.length;

    const daysOnline = products.map(p => p.days_online);
    const averageDaysOnline = Math.round(daysOnline.reduce((acc, d) => acc + d, 0) / products.length);

    return {
      lowestPrice,
      highestPrice,
      averagePrice,
      averageSalesPerDay,
      averageDaysOnline
    };
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-8 text-center">
        <p className="text-slate-400 font-medium">Nenhum dado estatístico disponível para esta busca vazia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Produtos */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-4.5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Produtos Encontrados</span>
            <h3 className="text-2xl font-bold text-white font-display">{search.productsCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        {/* Média de Preço */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-4.5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Preço Médio do Mercado</span>
            <h3 className="text-2xl font-bold text-white font-display">
              R$ {stats?.averagePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Média de Vendas por Dia */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-4.5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Média de Vendas/Dia</span>
            <h3 className="text-2xl font-bold text-emerald-400 font-display">
              {stats?.averageSalesPerDay.toFixed(1)} / dia
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Média de Dias Online */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-4.5 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Média de Dias no Ar</span>
            <h3 className="text-2xl font-bold text-white font-display">
              {stats?.averageDaysOnline} dias
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Estatísticas de Distribuição e Preço Mínimo/Máximo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Painel de Logística & Canal */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 space-y-4 shadow-md">
          <h4 className="text-sm font-bold tracking-wide text-slate-200 uppercase flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-500" />
            <span>Distribuição Logística</span>
          </h4>
          
          <div className="space-y-3.5">
            {/* Canal: Catálogo vs Orgânico */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Catálogo vs Orgânico</span>
                <span className="text-white font-semibold">{search.catalogPercentage}% / {search.organicPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-[#1A2333] rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${search.catalogPercentage}%` }} />
                <div className="bg-slate-600 h-full flex-1" />
              </div>
            </div>

            {/* Logística: Full vs Standard */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Full vs Standard</span>
                <span className="text-white font-semibold">{search.fullPercentage}% / {search.standardPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-[#1A2333] rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${search.fullPercentage}%` }} />
                <div className="bg-slate-600 h-full flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Faixa de Preços */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 space-y-4.5 shadow-md">
          <h4 className="text-sm font-bold tracking-wide text-slate-200 uppercase flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Faixa de Preços Encontrada</span>
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2333]/50 border border-[#1E293B]/50 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" /> Menor Preço
              </span>
              <p className="text-base font-bold text-white font-mono">
                R$ {stats?.lowestPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-[#1A2333]/50 border border-[#1E293B]/50 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" /> Maior Preço
              </span>
              <p className="text-base font-bold text-white font-mono">
                R$ {stats?.highestPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Informações da Consulta */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 space-y-4 shadow-md">
          <h4 className="text-sm font-bold tracking-wide text-slate-200 uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Informações da Consulta</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#1E293B]/30">
              <span className="text-slate-400">Origem dos Dados:</span>
              <span className="text-white font-semibold">Mercado Livre (Proxy SaaS)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1E293B]/30">
              <span className="text-slate-400">Páginas Escaneadas:</span>
              <span className="text-white font-semibold">Até 10 páginas</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Data da Consulta:</span>
              <span className="text-white font-semibold font-mono">{search.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
