import React, { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { FileSpreadsheet, Download, CheckCircle, Info, ShieldAlert, FileText, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExportPage: React.FC = () => {
  const { currentSearch, favorites, exportData } = useGlobal();
  const [selectedFormat, setSelectedFormat] = useState<"Excel" | "CSV" | "PDF">("Excel");
  const [includeStats, setIncludeStats] = useState(true);
  const [includeFilters, setIncludeFilters] = useState(true);
  const [dataSource, setDataSource] = useState<"active_search" | "favorites">("active_search");

  const handleExport = () => {
    const dataToExport = dataSource === "active_search" ? currentSearch : { products: favorites };
    exportData(selectedFormat, dataToExport);
  };

  const hasActiveSearch = currentSearch && currentSearch.products.length > 0;
  const hasFavorites = favorites.length > 0;

  return (
    <div className="space-y-6">
      {/* Banner / Cabeçalho */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Central de Exportações
          </h2>
          <p className="text-xs text-slate-400">
            Gere relatórios completos de mercado ou planilhas de concorrentes em segundos. Escolha o formato ideal para alimentar seu CRM, ERP ou realizar análises locais mais detalhadas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Configurações de Exportação */}
        <div className="lg:col-span-2 bg-[#131A2A] border border-[#1E293B] rounded-xl p-6 space-y-6 shadow-md">
          <h3 className="text-sm font-bold tracking-wide text-slate-200 uppercase">Configurações do Relatório</h3>

          {/* Origem dos Dados */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Origem dos Dados</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setDataSource("active_search")}
                disabled={!hasActiveSearch}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                  dataSource === "active_search" 
                    ? "bg-blue-950/20 border-blue-500/40 text-white" 
                    : "bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <span className="text-xs font-bold">Busca Ativa</span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {hasActiveSearch ? `"${currentSearch.keyword}" (${currentSearch.products.length} itens)` : "Nenhuma busca ativa"}
                </span>
              </button>

              <button
                onClick={() => setDataSource("favorites")}
                disabled={!hasFavorites}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                  dataSource === "favorites" 
                    ? "bg-blue-950/20 border-blue-500/40 text-white" 
                    : "bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <span className="text-xs font-bold">Produtos Favoritos</span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {hasFavorites ? `Lista de Monitoramento (${favorites.length} itens)` : "Nenhum favorito salvo"}
                </span>
              </button>
            </div>
          </div>

          {/* Formato de Arquivo */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Formato do Arquivo</label>
            <div className="grid grid-cols-3 gap-3">
              {(["Excel", "CSV", "PDF"] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border font-semibold transition-all",
                    selectedFormat === format 
                      ? "bg-blue-950/20 border-blue-500/50 text-blue-400" 
                      : "bg-[#0B0F19] border-[#1E293B] text-slate-400 hover:text-white"
                  )}
                >
                  <span className="text-sm">{format}</span>
                  <span className="text-[9px] text-slate-500 mt-1">
                    {format === "Excel" ? ".xlsx" : format === "CSV" ? ".csv" : ".pdf"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Seções Adicionais */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Opções do Documento</label>
            <div className="space-y-2.5 bg-[#0B0F19] p-4 rounded-xl border border-[#1E293B]/50">
              <label className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                  className="rounded border-[#1E293B] bg-[#131A2A] text-blue-500 focus:ring-blue-500/30"
                />
                Incluir estatísticas resumidas e consolidadas de mercado
              </label>
              <label className="flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFilters}
                  onChange={(e) => setIncludeFilters(e.target.checked)}
                  className="rounded border-[#1E293B] bg-[#131A2A] text-blue-500 focus:ring-blue-500/30"
                />
                Incluir filtros de pesquisa aplicados
              </label>
            </div>
          </div>

          {/* Botão de Download */}
          <button
            onClick={handleExport}
            disabled={dataSource === "active_search" ? !hasActiveSearch : !hasFavorites}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Gerar e Baixar Relatório</span>
          </button>
        </div>

        {/* Resumo Visual do Relatório / Sidebar informativa */}
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-6 space-y-5 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wide text-slate-200 uppercase">Pré-visualização</h3>
            
            <div className="border border-[#1E293B] rounded-xl bg-[#0B0F19] p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Estrutura do Arquivo</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Metadados da busca</span>
                </div>
                {includeStats && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Resumos consolidados (Estatísticas)</span>
                  </div>
                )}
                {includeFilters && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Filtros aplicados</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tabela de produtos (colunas detalhadas)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#1E293B]/50">
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p>Os arquivos Excel e CSV gerados contêm as fórmulas matemáticas descritas nas especificações da plataforma.</p>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>O MarketSpy garante conformidade com as diretrizes de privacidade ao analisar apenas dados de anúncios públicos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
