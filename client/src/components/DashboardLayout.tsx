import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useGlobal } from "../contexts/GlobalContext";
import { SearchPage } from "./SearchPage";
import { FavoritesPage } from "./FavoritesPage";
import { HistoryPage } from "./HistoryPage";
import { ExportPage } from "./ExportPage";
import { DashboardPage } from "./DashboardPage";

export const DashboardLayout: React.FC = () => {
  const { activeTab } = useGlobal();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] text-[#F8FAFC] font-sans antialiased">
      {/* Barra Lateral de Navegação */}
      <Sidebar />

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Cabeçalho Superior */}
        <Header />

        {/* Corpo com Scroll */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "Busca e Análise" && (
            <>
              <SearchPage />
              <DashboardPage />
            </>
          )}
          {activeTab === "Favoritos" && <FavoritesPage />}
          {activeTab === "Histórico" && <HistoryPage />}
          {activeTab === "Exportações" && <ExportPage />}
        </main>
      </div>
    </div>
  );
};
