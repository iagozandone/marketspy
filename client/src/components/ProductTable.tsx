import React, { useState, useMemo } from "react";
import { Product } from "../lib/mockData";
import { useGlobal } from "../contexts/GlobalContext";
import { 
  Star, 
  ExternalLink, 
  ArrowUpDown, 
  ShoppingBag, 
  Eye, 
  CalendarDays,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
}

type SortField = "price" | "visits_last_7_days" | "days_online" | "sales_per_day" | "total_sales";
type SortOrder = "asc" | "desc";

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { toggleFavorite, isFavorite } = useGlobal();
  const [sortField, setSortField] = useState<SortField>("visits_last_7_days");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [activeTab, setActiveTab] = useState<"all" | "catalog" | "organic">("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filtro rápido de aba
    if (activeTab === "catalog") {
      result = result.filter(p => p.listing_type === "catalog");
    } else if (activeTab === "organic") {
      result = result.filter(p => p.listing_type === "organic");
    }

    // Ordenação
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [products, sortField, sortOrder, activeTab]);

  const getReputationColor = (reputation: Product["seller_reputation"]) => {
    switch (reputation) {
      case "platinum": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "gold": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "green": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "yellow": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "red": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Abas Rápidas e Controle de Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131A2A] border border-[#1E293B] rounded-xl p-3">
        <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1 rounded-lg border border-[#1E293B]/50">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeTab === "all" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
            )}
          >
            Todos os Resultados ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeTab === "catalog" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
            )}
          >
            Apenas Catálogo ({products.filter(p => p.listing_type === "catalog").length})
          </button>
          <button
            onClick={() => setActiveTab("organic")}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeTab === "organic" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
            )}
          >
            Apenas Orgânico ({products.filter(p => p.listing_type === "organic").length})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
          <span>Ordenando por: <strong className="text-white capitalize">{sortField.replace(/_/g, " ")} ({sortOrder === "asc" ? "Crescente" : "Decrescente"})</strong></span>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#1A2333]/50 text-xs font-bold tracking-wider text-slate-400">
                <th className="py-4 px-4 w-12 text-center">Fav</th>
                <th className="py-4 px-4 min-w-[280px]">Produto / Concorrente</th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-all" onClick={() => handleSort("price")}>
                  <div className="flex items-center gap-1.5">Preço <ArrowUpDown className="w-3 h-3 text-blue-500" /></div>
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-all" onClick={() => handleSort("visits_last_7_days")}>
                  <div className="flex items-center gap-1.5">Visitas (7d) <ArrowUpDown className="w-3 h-3 text-blue-500" /></div>
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-all" onClick={() => handleSort("days_online")}>
                  <div className="flex items-center gap-1.5">Dias no Ar <ArrowUpDown className="w-3 h-3 text-blue-500" /></div>
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-all" onClick={() => handleSort("sales_per_day")}>
                  <div className="flex items-center gap-1.5">Vendas/Dia <ArrowUpDown className="w-3 h-3 text-blue-500" /></div>
                </th>
                <th className="py-4 px-4 cursor-pointer hover:text-white transition-all" onClick={() => handleSort("total_sales")}>
                  <div className="flex items-center gap-1.5">Vendas Totais <ArrowUpDown className="w-3 h-3 text-blue-500" /></div>
                </th>
                <th className="py-4 px-4">Logística / Vendedor</th>
                <th className="py-4 px-4 text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/50 text-sm text-slate-300">
              {filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                    Nenhum concorrente encontrado com as configurações e filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredAndSortedProducts.map((product) => {
                  const isFav = isFavorite(product.id);
                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-[#1A2333]/30 transition-colors group"
                    >
                      {/* Botão de Favoritar */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleFavorite(product)}
                          className={cn(
                            "p-1.5 rounded-md hover:bg-[#1A2333] transition-all",
                            isFav ? "text-amber-500" : "text-slate-500 hover:text-amber-500/80"
                          )}
                        >
                          <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </td>

                      {/* Produto Detalhes */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-11 h-11 rounded-lg border border-[#1E293B] object-cover bg-slate-900"
                          />
                          <div className="min-w-0 space-y-1">
                            <p className="font-semibold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                              {product.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-500">{product.product_id}</span>
                              <span className="text-[10px] text-slate-500">•</span>
                              <span className="text-[10px] text-slate-500">Pág. {product.page_found}</span>
                              <span className="text-[10px] text-slate-500">•</span>
                              <span className={cn(
                                "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm border",
                                product.listing_type === "catalog" 
                                  ? "bg-blue-950/40 text-blue-400 border-blue-900/30" 
                                  : "bg-slate-950/40 text-slate-400 border-slate-900/30"
                              )}>
                                {product.listing_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Preço */}
                      <td className="py-4 px-4 font-semibold text-slate-100 font-mono">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Visitas */}
                      <td className="py-4 px-4 font-mono text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>{product.visits_last_7_days.toLocaleString("pt-BR")}</span>
                        </div>
                      </td>

                      {/* Dias no ar */}
                      <td className="py-4 px-4 font-mono text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                          <span>{product.days_online} dias</span>
                        </div>
                      </td>

                      {/* Vendas por dia */}
                      <td className="py-4 px-4 font-semibold text-emerald-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{product.sales_per_day} / dia</span>
                        </div>
                      </td>

                      {/* Vendas totais */}
                      <td className="py-4 px-4 font-mono text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                          <span>{product.total_sales.toLocaleString("pt-BR")}</span>
                        </div>
                      </td>

                      {/* Logística / Vendedor */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm border",
                              product.logistics_type === "full" 
                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" 
                                : "bg-slate-950/40 text-slate-400 border-slate-900/30"
                            )}>
                              {product.logistics_type}
                            </span>
                            <span className={cn(
                              "text-[9px] font-semibold border px-1.5 py-0.5 rounded uppercase",
                              getReputationColor(product.seller_reputation)
                            )}>
                              {product.seller_reputation}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{product.seller_name}</p>
                        </div>
                      </td>

                      {/* Botão de Link Externo */}
                      <td className="py-4 px-4 text-center">
                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 rounded-md hover:bg-[#1A2333] text-slate-400 hover:text-white transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
