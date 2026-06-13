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

// Frontend
const distPath = path.resolve(__dirname, "..", "dist");
app.use(express.static(distPath));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =========================
// MERCADO LIVRE TOKEN
// =========================

async function getAccessToken() {
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
        Accept: "application/json",
      },
    }
  );

  return response.data.access_token;
}

// =========================
// TESTE TOKEN
// =========================

app.get("/api/test-ml", async (_req, res) => {
  try {
    const token = await getAccessToken();

    const userResponse = await axios.get(
      "https://api.mercadolibre.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.json({
      success: true,
      user: userResponse.data,
    });
  } catch (error: any) {
    console.error(error?.response?.data || error);

    return res.status(500).json({
      success: false,
      error: error?.response?.data || error.message,
    });
  }
});

// =========================
// BUSCA
// =========================

app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: "Query required",
      });
    }

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
        },
      }
    );

    const results = mlResponse.data.results || [];

    const products = results.map((item: any) => ({
      id: `ml-${item.id}`,
      title: item.title,
      price: item.price,
      product_id: item.id,
      total_sales: item.sold_quantity || 0,
      seller_name: item.seller?.nickname || "Mercado Livre",
      product_url: item.permalink,
      image: item.thumbnail || "",
    }));

    return res.json({
      products,
    });
  } catch (error: any) {
    console.error(
      "[ML SEARCH ERROR]",
      error?.response?.status,
      error?.response?.data
    );

    return res.status(error?.response?.status || 500).json({
      error: "Mercado Livre Error",
      details: error?.response?.data || error.message,
    });
  }
});

// SPA React
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// IMPORTANTE:
// SEMPRE iniciar servidor
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`🚀 MarketSpy rodando na porta ${port}`);
});

export default app;