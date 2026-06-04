export interface Product {
  id: string;
  title: string;
  price: number;
  product_id: string;
  page_found: number;
  visits_last_7_days: number;
  days_online: number;
  sales_per_day: number;
  sales_per_week: number;
  total_sales: number;
  listing_type: "catalog" | "organic";
  logistics_type: "full" | "standard";
  seller_name: string;
  seller_reputation: "platinum" | "gold" | "green" | "yellow" | "red";
  product_url: string;
  image: string;
}

export interface SearchHistoryEntry {
  id: string;
  keyword: string;
  date: string;
  status: "completed" | "processing" | "failed";
  productsCount: number;
  catalogPercentage: number;
  organicPercentage: number;
  fullPercentage: number;
  standardPercentage: number;
  filtersUsed: Record<string, any>;
  products: Product[];
}

export const MOCK_PRODUCTS_CELULAR: Product[] = [
  {
    id: "ml-101",
    title: "Smartphone Moto G24 Power 128gb 4gb Ram - Azul",
    price: 899.00,
    product_id: "MLB40291039",
    page_found: 1,
    visits_last_7_days: 1250,
    days_online: 45,
    sales_per_day: 3.2,
    sales_per_week: 22.4,
    total_sales: 144,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Mercado Livre Eletronicos",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB40291039",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-102",
    title: "Samsung Galaxy A15 4g 128gb 4gb Ram Azul-escuro",
    price: 949.00,
    product_id: "MLB36192831",
    page_found: 1,
    visits_last_7_days: 2100,
    days_online: 60,
    sales_per_day: 5.5,
    sales_per_week: 38.5,
    total_sales: 330,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Samsung Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB36192831",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-103",
    title: "Celular Xiaomi Redmi Note 13 4g 256gb 8gb Ram Original",
    price: 1249.90,
    product_id: "MLB45291029",
    page_found: 1,
    visits_last_7_days: 3500,
    days_online: 90,
    sales_per_day: 8.4,
    sales_per_week: 58.8,
    total_sales: 756,
    listing_type: "organic",
    logistics_type: "full",
    seller_name: "Mi Brasil Store",
    seller_reputation: "gold",
    product_url: "https://www.mercadolivre.com.br/p/MLB45291029",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-104",
    title: "iPhone 13 Apple (128 GB) Meia-noite - Distribuidor Autorizado",
    price: 3699.00,
    product_id: "MLB28192019",
    page_found: 1,
    visits_last_7_days: 4800,
    days_online: 120,
    sales_per_day: 12.1,
    sales_per_week: 84.7,
    total_sales: 1452,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Apple Store Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB28192019",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-105",
    title: "Smartphone Motorola Moto G34 5g 128gb 4gb Ram Grafite",
    price: 1049.00,
    product_id: "MLB49201928",
    page_found: 2,
    visits_last_7_days: 950,
    days_online: 30,
    sales_per_day: 2.1,
    sales_per_week: 14.7,
    total_sales: 63,
    listing_type: "organic",
    logistics_type: "standard",
    seller_name: "Eletro-Mundo Varejo",
    seller_reputation: "green",
    product_url: "https://www.mercadolivre.com.br/p/MLB49201928",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-106",
    title: "Poco X6 Pro 5g 512gb 12gb Ram Versao Global Preto",
    price: 2199.00,
    product_id: "MLB50192831",
    page_found: 2,
    visits_last_7_days: 1800,
    days_online: 50,
    sales_per_day: 4.8,
    sales_per_week: 33.6,
    total_sales: 240,
    listing_type: "organic",
    logistics_type: "full",
    seller_name: "Smart-Imports BR",
    seller_reputation: "gold",
    product_url: "https://www.mercadolivre.com.br/p/MLB50192831",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-107",
    title: "Smartphone Realme Note 50 128gb 4gb Ram - Preto",
    price: 679.00,
    product_id: "MLB51292019",
    page_found: 2,
    visits_last_7_days: 800,
    days_online: 25,
    sales_per_day: 1.8,
    sales_per_week: 12.6,
    total_sales: 45,
    listing_type: "organic",
    logistics_type: "standard",
    seller_name: "Mega Vendas Online",
    seller_reputation: "yellow",
    product_url: "https://www.mercadolivre.com.br/p/MLB51292019",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-108",
    title: "Celular Samsung Galaxy S24 Ultra 512gb Titanio Cinza",
    price: 6499.00,
    product_id: "MLB39102910",
    page_found: 3,
    visits_last_7_days: 4200,
    days_online: 100,
    sales_per_day: 6.5,
    sales_per_week: 45.5,
    total_sales: 650,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Samsung Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB39102910",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-109",
    title: "iPhone 15 Pro Max Apple (256 GB) Titanio Natural",
    price: 7899.00,
    product_id: "MLB48291023",
    page_found: 3,
    visits_last_7_days: 5100,
    days_online: 150,
    sales_per_day: 7.2,
    sales_per_week: 50.4,
    total_sales: 1080,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Apple Store Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB48291023",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-110",
    title: "Smartphone Infinix Hot 40i 256gb 8gb Ram - Dourado",
    price: 849.00,
    product_id: "MLB52102931",
    page_found: 4,
    visits_last_7_days: 450,
    days_online: 15,
    sales_per_day: 0.8,
    sales_per_week: 5.6,
    total_sales: 12,
    listing_type: "organic",
    logistics_type: "standard",
    seller_name: "Varejo Express",
    seller_reputation: "red",
    product_url: "https://www.mercadolivre.com.br/p/MLB52102931",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=150&q=80"
  }
];

export const MOCK_PRODUCTS_FONE: Product[] = [
  {
    id: "ml-201",
    title: "Fone de Ouvido Bluetooth JBL Wave Flex - Preto",
    price: 289.00,
    product_id: "MLB39201923",
    page_found: 1,
    visits_last_7_days: 1800,
    days_online: 90,
    sales_per_day: 4.5,
    sales_per_week: 31.5,
    total_sales: 405,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "JBL Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB39201923",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-202",
    title: "Headphone Sem Fio Philips TAH1205bk/00 - Preto",
    price: 139.90,
    product_id: "MLB38201922",
    page_found: 1,
    visits_last_7_days: 1100,
    days_online: 60,
    sales_per_day: 3.8,
    sales_per_week: 26.6,
    total_sales: 228,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Philips Loja Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB38201922",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-203",
    title: "Fone Bluetooth Xiaomi Redmi Buds 5 Original Versao Global",
    price: 179.00,
    product_id: "MLB40192831",
    page_found: 1,
    visits_last_7_days: 2900,
    days_online: 45,
    sales_per_day: 7.5,
    sales_per_week: 52.5,
    total_sales: 337,
    listing_type: "organic",
    logistics_type: "full",
    seller_name: "Xiaomi Direct",
    seller_reputation: "gold",
    product_url: "https://www.mercadolivre.com.br/p/MLB40192831",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-204",
    title: "Fone de Ouvido AirPods Apple 3 Geracao com Estojo de Recarga Lightning",
    price: 1399.00,
    product_id: "MLB29102912",
    page_found: 1,
    visits_last_7_days: 2200,
    days_online: 120,
    sales_per_day: 2.9,
    sales_per_week: 20.3,
    total_sales: 348,
    listing_type: "catalog",
    logistics_type: "full",
    seller_name: "Apple Store Oficial",
    seller_reputation: "platinum",
    product_url: "https://www.mercadolivre.com.br/p/MLB29102912",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "ml-205",
    title: "Fone QCY T13 Bluetooth 5.1 TWS Sem Fio 4 Microfones Touch",
    price: 129.00,
    product_id: "MLB48291022",
    page_found: 2,
    visits_last_7_days: 3400,
    days_online: 180,
    sales_per_day: 9.2,
    sales_per_week: 64.4,
    total_sales: 1656,
    listing_type: "organic",
    logistics_type: "standard",
    seller_name: "QCY Imports",
    seller_reputation: "green",
    product_url: "https://www.mercadolivre.com.br/p/MLB48291022",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80"
  }
];

export const MOCK_HISTORY: SearchHistoryEntry[] = [
  {
    id: "hist-1",
    keyword: "celular smartphone",
    date: "2026-06-03 10:15:30",
    status: "completed",
    productsCount: 10,
    catalogPercentage: 60,
    organicPercentage: 40,
    fullPercentage: 70,
    standardPercentage: 30,
    filtersUsed: { visits_last_7_days: 100 },
    products: MOCK_PRODUCTS_CELULAR
  },
  {
    id: "hist-2",
    keyword: "fone de ouvido bluetooth",
    date: "2026-06-02 16:45:12",
    status: "completed",
    productsCount: 5,
    catalogPercentage: 60,
    organicPercentage: 40,
    fullPercentage: 80,
    standardPercentage: 20,
    filtersUsed: { visits_last_7_days: 100 },
    products: MOCK_PRODUCTS_FONE
  },
  {
    id: "hist-3",
    keyword: "teclado mecanico rgb",
    date: "2026-06-01 11:20:05",
    status: "completed",
    productsCount: 0,
    catalogPercentage: 0,
    organicPercentage: 0,
    fullPercentage: 0,
    standardPercentage: 0,
    filtersUsed: {},
    products: []
  }
];
