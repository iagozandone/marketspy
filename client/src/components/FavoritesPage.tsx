import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { ProductTable } from "./ProductTable";
import { Star, Info } from "lucide-react";

export const FavoritesPage: React.FC = () => {
  const { favorites } = useGlobal();

  return (
    <div className="space-y-6">
      {/* Banner / Cabeçalho do Módulo */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
            Produtos Favoritos & Monitoramento
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe concorrentes específicos salvos durante suas análises. Você pode usá-los para comparar preços e vendas futuras ou exportá-los em lote para planilhas.
          </p>
        </div>
      </div>

      {/* Tabela de Favoritos */}
      {favorites.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Você tem <strong>{favorites.length} produtos salvos</strong> na sua lista de monitoramento rápido.</span>
          </div>
          <ProductTable products={favorites} />
        </div>
      ) : (
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-16 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mx-auto">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Nenhum favorito salvo</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando estiver analisando os resultados na aba <strong className="text-blue-400">"Busca e Análise"</strong>, clique na estrela ao lado de qualquer concorrente para salvá-lo aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
