import React, { useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { ProductTable } from "./ProductTable";
import { SearchDetails } from "./SearchDetails";
import { AdvancedFilters } from "./AdvancedFilters";
import { Search, Loader2, RefreshCw, Sparkles } from "lucide-react";

export const SearchPage: React.FC = () => {
  const { currentSearch, performSearch, history } = useGlobal();
  const [keyword, setKeyword] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      await performSearch(keyword, activeFilters);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    if (currentSearch) {
      // Re-executa a busca ativa aplicando os filtros novos
      performSearch(currentSearch.keyword, filters);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    if (currentSearch) {
      performSearch(currentSearch.keyword, {});
    }
  };

  const handleQuickSearch = (word: string) => {
    setKeyword(word);
    performSearch(word, activeFilters);
  };

  const recentSearches = history
    .filter(h => h.status === "completed")
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa Principal */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Efeito decorativo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-3xl space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Pesquisa Inteligente de Concorrentes
            </h2>
            <p className="text-xs text-slate-400">
              Digite qualquer produto ou palavra-chave para escanear anúncios do Mercado Livre, analisar preços, visitas, logística e estimativa de vendas.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Ex: celular xiaomi redmi note 13, fone jbl bluetooth..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#1E293B] hover:border-slate-700 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/15 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Escaneando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Analisar Concorrentes</span>
                </>
              )}
            </button>
          </form>

          {/* Buscas Recentes Rápidas */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Sugestões de busca:</span>
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleQuickSearch(search.keyword)}
                  className="text-xs bg-[#1A2333]/50 hover:bg-[#1A2333] text-slate-300 hover:text-white px-3 py-1 rounded-full border border-[#1E293B]/60 hover:border-blue-500/30 transition-all font-medium"
                >
                  {search.keyword}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters 
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Exibição de Detalhes da Busca e Tabela de Resultados */}
      {currentSearch ? (
        currentSearch.status === "processing" ? (
          <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Escaneando o Mercado Livre</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Buscando anúncios concorrentes para <strong className="text-blue-400">"{currentSearch.keyword}"</strong>, filtrando dados e calculando estatísticas de mercado. Por favor, aguarde.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Detalhes / Estatísticas da Busca */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider text-slate-400">
                Resumo de Mercado: {currentSearch.keyword}
              </h3>
              <SearchDetails search={currentSearch} />
            </div>

            {/* Tabela de Produtos */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider text-slate-400">
                Concorrentes Encontrados
              </h3>
              <ProductTable products={currentSearch.products} />
            </div>
          </div>
        )
      ) : (
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-16 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mx-auto">
            <Search className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Nenhuma análise ativa</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Utilize a barra de busca acima para pesquisar qualquer nicho de mercado ou produto e iniciar uma varredura completa de concorrentes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
