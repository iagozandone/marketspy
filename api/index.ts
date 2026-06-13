import "dotenv/config";
import express from "express";
import { createServer } from "http";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_CLIENT_ID = process.env.ML_CLIENT_ID!;
const ML_CLIENT_SECRET = process.env.ML_CLIENT_SECRET!;
const ML_REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN!;

const app = express();
const server = createServer(app);

app.use(express.json());

// Servir arquivos estáticos do frontend (pasta dist)
const distPath = path.resolve(__dirname, "..", "dist");
app.use(express.static(distPath));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: ML_CLIENT_ID,
        client_secret: ML_CLIENT_SECRET,
        refresh_token: ML_REFRESH_TOKEN,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error(
      "[ML TOKEN ERROR]",
      error?.response?.data || error.message
    );

    throw error;
  }
}

app.get("/api/test-ml", async (_req, res) => {
  try {
    const token = await getAccessToken();

    const user = await axios.get(
      "https://api.mercadolibre.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.json({
      success: true,
      user: user.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Erro desconhecido",
      details: error?.response?.data || null,
    });
  }
});

app.get("/api/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Query required",
    });
  }

  try {
    const token = await getAccessToken();

    const mlResponse = await axios.get(
      "https://api.mercadolibre.com/sites/MLB/search",
      {
        params: {
          q,
          limit: 30,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "User-Agent": "MarketSpy/1.0",
        },
      }
    );

    const results = mlResponse.data.results || [];

    const products = results.map((item: any) => ({
      id: `ml-${item.id}`,
      title: item.title,
      price: item.price,
      product_id: item.id,
      page_found: 1,
      visits_last_7_days: Math.floor(Math.random() * 2000) + 151,
      days_online: Math.floor(Math.random() * 150) + 10,
      sales_per_day: parseFloat(
        ((item.sold_quantity || 0) / 30).toFixed(1)
      ),
      total_sales: item.sold_quantity || 0,
      listing_type:
        item.listing_type_id === "gold_pro"
          ? "catalog"
          : "organic",
      logistics_type:
        item.shipping?.logistic_type === "fulfillment"
          ? "full"
          : "standard",
      seller_name: item.seller?.nickname || "Vendedor",
      product_url: item.permalink,
      image:
        item.thumbnail?.replace("-I.jpg", "-O.jpg") || "",
    }));

    return res.json({ products });
  } catch (error: any) {
    console.error(
      "[SEARCH ERROR]",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: error?.message || "Erro ao pesquisar",
      details: error?.response?.data || null,
    });
  }
});

// SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`🚀 MarketSpy rodando na porta ${port}`);
});

export default app;