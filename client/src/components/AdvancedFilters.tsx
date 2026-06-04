import React, { useState } from "react";
import { Filter, SlidersHorizontal, RotateCcw } from "lucide-react";

interface AdvancedFiltersProps {
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onApplyFilters, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    catalog_only: false,
    organic_only: false,
    full_only: false,
    standard_only: false,
    minimum_visits: "",
    minimum_total_sales: "",
    minimum_price: "",
    maximum_price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const cleared = {
      catalog_only: false,
      organic_only: false,
      full_only: false,
      standard_only: false,
      minimum_visits: "",
      minimum_total_sales: "",
      minimum_price: "",
      maximum_price: "",
    };
    setFilters(cleared);
    onClearFilters();
  };

  return (
    <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 hover:text-white transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <span>Filtros Avançados</span>
          <span className="text-[10px] bg-[#1A2333] border border-[#1E293B] text-slate-400 px-2 py-0.5 rounded-full">
            {Object.values(filters).filter(v => v === true || v !== "").length} ativos
          </span>
        </button>

        {isOpen && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all px-2.5 py-1.5 rounded bg-[#1A2333]/50 hover:bg-[#1A2333]"
            >
              <RotateCcw className="w-3 h-3" /> Limpar
            </button>
            <button
              onClick={handleApply}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded transition-all shadow-md shadow-blue-500/10"
            >
              Aplicar Filtros
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-5 mt-4 border-t border-[#1E293B]/50 transition-all duration-300">
          {/* Tipo de Listagem */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Listagem</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="catalog_only"
                  checked={filters.catalog_only}
                  onChange={handleChange}
                  disabled={filters.organic_only}
                  className="rounded border-[#1E293B] bg-[#1A2333] text-blue-500 focus:ring-blue-500/30"
                />
                Apenas Catálogo
              </label>
              <label className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="organic_only"
                  checked={filters.organic_only}
                  onChange={handleChange}
                  disabled={filters.catalog_only}
                  className="rounded border-[#1E293B] bg-[#1A2333] text-blue-500 focus:ring-blue-500/30"
                />
                Apenas Orgânico
              </label>
            </div>
          </div>

          {/* Logística */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Logística</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="full_only"
                  checked={filters.full_only}
                  onChange={handleChange}
                  disabled={filters.standard_only}
                  className="rounded border-[#1E293B] bg-[#1A2333] text-blue-500 focus:ring-blue-500/30"
                />
                Apenas Full
              </label>
              <label className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="standard_only"
                  checked={filters.standard_only}
                  onChange={handleChange}
                  disabled={filters.full_only}
                  className="rounded border-[#1E293B] bg-[#1A2333] text-blue-500 focus:ring-blue-500/30"
                />
                Apenas Standard
              </label>
            </div>
          </div>

          {/* Métricas de Desempenho */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Performance Mínima</label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  name="minimum_visits"
                  placeholder="Visitas mínimas (7 dias)"
                  value={filters.minimum_visits}
                  onChange={handleChange}
                  className="w-full text-xs bg-[#1A2333] border border-[#1E293B] rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="minimum_total_sales"
                  placeholder="Vendas totais mínimas"
                  value={filters.minimum_total_sales}
                  onChange={handleChange}
                  className="w-full text-xs bg-[#1A2333] border border-[#1E293B] rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">Faixa de Preço</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minimum_price"
                placeholder="Mínimo R$"
                value={filters.minimum_price}
                onChange={handleChange}
                className="w-1/2 text-xs bg-[#1A2333] border border-[#1E293B] rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="number"
                name="maximum_price"
                placeholder="Máximo R$"
                value={filters.maximum_price}
                onChange={handleChange}
                className="w-1/2 text-xs bg-[#1A2333] border border-[#1E293B] rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
