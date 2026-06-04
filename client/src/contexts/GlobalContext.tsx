import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, SearchHistoryEntry, MOCK_HISTORY } from "../lib/mockData";
import { toast } from "sonner";
import axios from "axios";

interface GlobalContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  history: SearchHistoryEntry[];
  favorites: Product[];
  currentSearch: SearchHistoryEntry | null;
  setCurrentSearch: (search: SearchHistoryEntry | null) => void;
  performSearch: (keyword: string, filters?: Record<string, any>) => Promise<void>;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  exportData: (format: "Excel" | "CSV" | "PDF", data: any) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("Busca e Análise");
  
  const [history, setHistory] = useState<SearchHistoryEntry[]>(() => {
    const saved = localStorage.getItem("marketspy_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      // 🔥 Correção 1: Se o navegador salvou uma busca travada no passado, muda para "falha" para não girar infinito
      return parsed.map((item: any) => item.status === "processing" ? { ...item, status: "failed" } : item);
    }
    return MOCK_HISTORY;
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem("marketspy_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSearch, setCurrentSearch] = useState<SearchHistoryEntry | null>(() => {
    const saved = localStorage.getItem("marketspy_current_search");
    if (saved) {
      const parsed = JSON.parse(saved);
      // 🔥 Correção 1.2: Destrava a tela principal ao iniciar
      return parsed.status === "processing" ? { ...parsed, status: "failed" } : parsed;
    }
    return MOCK_HISTORY[0];
  });

  useEffect(() => {
    localStorage.setItem("marketspy_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("marketspy_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentSearch) {
      localStorage.setItem("marketspy_current_search", JSON.stringify(currentSearch));
    } else {
      localStorage.removeItem("marketspy_current_search");
    }
  }, [currentSearch]);

  const performSearch = async (keyword: string, filters: Record<string, any> = {}) => {
    if (!keyword.trim()) {
      toast.error("Por favor, insira uma palavra-chave para buscar.");
      return;
    }

    const searchId = `search-${Date.now()}`;
    const newEntryPlaceholder: SearchHistoryEntry = {
      id: searchId,
      keyword: keyword,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      status: "processing",
      productsCount: 0,
      catalogPercentage: 0,
      organicPercentage: 0,
      fullPercentage: 0,
      standardPercentage: 0,
      filtersUsed: filters,
      products: []
    };

    setHistory(prev => [newEntryPlaceholder, ...prev]);
    setCurrentSearch(newEntryPlaceholder);
    setActiveTab("Busca e Análise");

    toast.info(`Iniciando busca por "${keyword}"...`);

    try {
      const response = await axios.get('http://localhost:3000/api/search', {
        params: { q: keyword }
      });
      
      let matchedProducts: Product[] = response.data.products || [];

      // 🔥 NOVA REGRA: Elimina qualquer anúncio com menos de 150 visitas nos últimos 7 dias
      let filteredProducts = matchedProducts.filter(p => p.visits_last_7_days >= 150);

      // Aplica os outros filtros da interface se houver
      if (filters.catalog_only) {
        filteredProducts = filteredProducts.filter(p => p.listing_type === "catalog");
      }
      if (filters.organic_only) {
        filteredProducts = filteredProducts.filter(p => p.listing_type === "organic");
      }
      if (filters.full_only) {
        filteredProducts = filteredProducts.filter(p => p.logistics_type === "full");
      }
      if (filters.standard_only) {
        filteredProducts = filteredProducts.filter(p => p.logistics_type === "standard");
      }
      if (filters.minimum_price) {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minimum_price));
      }
      if (filters.maximum_price) {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maximum_price));
      }
      if (filters.minimum_total_sales) {
        filteredProducts = filteredProducts.filter(p => p.total_sales >= Number(filters.minimum_total_sales));
      }

      const totalCount = filteredProducts.length;
      const catalogCount = filteredProducts.filter(p => p.listing_type === "catalog").length;
      const fullCount = filteredProducts.filter(p => p.logistics_type === "full").length;

      const completedEntry: SearchHistoryEntry = {
        id: searchId,
        keyword: keyword,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        status: "completed",
        productsCount: totalCount,
        catalogPercentage: totalCount > 0 ? Math.round((catalogCount / totalCount) * 100) : 0,
        organicPercentage: totalCount > 0 ? Math.round(((totalCount - catalogCount) / totalCount) * 100) : 0,
        fullPercentage: totalCount > 0 ? Math.round((fullCount / totalCount) * 100) : 0,
        standardPercentage: totalCount > 0 ? Math.round(((totalCount - fullCount) / totalCount) * 100) : 0,
        filtersUsed: filters,
        products: filteredProducts
      };

      setHistory(prev => prev.map(item => item.id === searchId ? completedEntry : item));
      setCurrentSearch(completedEntry);
      toast.success(`Busca concluída! ${totalCount} produtos encontrados.`);

    } catch (error) {
      console.error("Erro na busca:", error);
      toast.error("Falha ao buscar produtos no Mercado Livre.");
      
      const failedEntry: SearchHistoryEntry = {
        ...newEntryPlaceholder,
        status: "failed"
      };

      setHistory(prev => prev.map(item => 
        item.id === searchId ? failedEntry : item
      ));
      
      // 🔥 Correção 2: Avisa a tela principal que deu erro para parar de girar
      setCurrentSearch(failedEntry);
    }
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        toast.info("Removido dos favoritos");
        return prev.filter(p => p.id !== product.id);
      } else {
        toast.success("Adicionado aos favoritos!");
        return [...prev, product];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId);
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentSearch?.id === id) {
      setCurrentSearch(null);
    }
    toast.success("Busca removida do histórico");
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentSearch(null);
    toast.success("Histórico limpo com sucesso");
  };

  const exportData = (format: "Excel" | "CSV" | "PDF", data: any) => {
    toast.success(`Exportando dados no formato ${format}...`);
    
    let fileContent = "";
    let mimeType = "text/plain";
    let fileName = `marketspy-export-${Date.now()}`;

    if (format === "CSV") {
      mimeType = "text/csv;charset=utf-8;";
      fileName += ".csv";
      
      const headers = ["ID", "Título", "Preço (R$)", "ID Produto", "Página", "Visitas (7d)", "Dias Online", "Vendas/Dia", "Vendas Totais", "Tipo Listagem", "Logística", "Vendedor"];
      const rows = (data.products || []).map((p: Product) => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        p.price,
        p.product_id,
        p.page_found,
        p.visits_last_7_days,
        p.days_online,
        p.sales_per_day,
        p.total_sales,
        p.listing_type,
        p.logistics_type,
        `"${p.seller_name.replace(/"/g, '""')}"`
      ]);
      
      fileContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    } else if (format === "Excel") {
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileName += ".xlsx";
      fileContent = "Mock Excel Binary Content";
    } else {
      mimeType = "application/pdf";
      fileName += ".pdf";
      fileContent = "Mock PDF Content";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exportação ${format} concluída!`);
  };

  return (
    <GlobalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        history,
        favorites,
        currentSearch,
        setCurrentSearch,
        performSearch,
        toggleFavorite,
        isFavorite,
        deleteHistoryEntry,
        clearHistory,
        exportData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};