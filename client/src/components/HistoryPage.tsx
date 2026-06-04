import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { History, Trash2, ArrowUpRight, Search, Eye } from "lucide-react";
import { toast } from "sonner";

export const HistoryPage: React.FC = () => {
  const { history, setCurrentSearch, setActiveTab, deleteHistoryEntry, clearHistory } = useGlobal();

  const handleReopen = (entry: any) => {
    setCurrentSearch(entry);
    setActiveTab("Busca e Análise");
    toast.success(`Carregando busca anterior por "${entry.keyword}"`);
  };

  const completedHistory = history.filter(h => h.status === "completed");

  return (
    <div className="space-y-6">
      {/* Banner / Cabeçalho */}
      <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Histórico de Consultas
          </h2>
          <p className="text-xs text-slate-400">
            Veja as buscas de mercado realizadas anteriormente. Reabra qualquer análise com um único clique para visualizar os concorrentes e estatísticas consolidadas novamente.
          </p>
        </div>

        {completedHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-950/40 px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Histórico
          </button>
        )}
      </div>

      {/* Lista de Histórico */}
      {completedHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedHistory.map((entry) => (
            <div 
              key={entry.id}
              className="bg-[#131A2A] border border-[#1E293B] rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    "{entry.keyword}"
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">Realizada em: {entry.date}</p>
                </div>
                <button
                  onClick={() => deleteHistoryEntry(entry.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-[#1A2333] rounded transition-all"
                  title="Excluir busca"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Estatísticas Rápidas da Busca */}
              <div className="grid grid-cols-3 gap-2 bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B]/50 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Produtos</span>
                  <span className="text-xs font-bold text-white font-mono">{entry.productsCount}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Catálogo</span>
                  <span className="text-xs font-bold text-blue-400 font-mono">{entry.catalogPercentage}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Full Logística</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{entry.fullPercentage}%</span>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => handleReopen(entry)}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/30 hover:bg-blue-600 border border-blue-900/40 hover:border-blue-500 px-4 py-2.5 rounded-lg transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                Reabrir Análise Completa
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#131A2A] border border-[#1E293B] rounded-2xl p-16 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mx-auto">
            <History className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Nenhum histórico disponível</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Seu histórico de buscas está vazio. Comece a pesquisar na aba <strong className="text-blue-400">"Busca e Análise"</strong> para registrar suas consultas aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
