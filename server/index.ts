import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mercado Livre
const ML_CLIENT_ID = process.env.ML_CLIENT_ID!;
const ML_CLIENT_SECRET = process.env.ML_CLIENT_SECRET!;
const ML_REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN!;

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // =========================
  // REFRESH TOKEN MERCADO LIVRE
  // =========================
  app.post("/api/ml/refresh-token", async (req, res) => {
    try {
      const refreshToken =
        req.body.refresh_token || ML_REFRESH_TOKEN;

      const response = await axios.post(
        "https://api.mercadolibre.com/oauth/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          client_id: ML_CLIENT_ID,
          client_secret: ML_CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      return res.json(response.data);
    } catch (error: any) {
      console.error(
        "[ML Refresh Error]",
        error?.response?.data || error
      );

      return res.status(500).json({
        error: "Failed to refresh token",
        details: error?.response?.data,
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
          error: "Keyword is required",
        });
      }

      console.log(`[SEARCH] ${q}`);

      const mlResponse = await axios.get(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(
          q as string
        )}&limit=15`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            Accept: "application/json",
          },
        }
      );

      const results = mlResponse.data.results || [];

      const formattedProducts = results.map((item: any) => {
        const mockDaysOnline =
          Math.floor(Math.random() * 150) + 10;

        const actualSales =
          item.sold_quantity ||
          Math.floor(Math.random() * 100);

        const salesPerDay = parseFloat(
          (actualSales / mockDaysOnline).toFixed(1)
        );

        return {
          id: `ml-${item.id}`,
          title: item.title,
          price: item.price,
          product_id: item.id,
          page_found: 1,
          visits_last_7_days:
            Math.floor(Math.random() * 2000) + 50,
          days_online: mockDaysOnline,
          sales_per_day: salesPerDay,
          sales_per_week: parseFloat(
            (salesPerDay * 7).toFixed(1)
          ),
          total_sales: actualSales,
          listing_type:
            item.listing_type_id === "gold_pro"
              ? "catalog"
              : "organic",
          logistics_type:
            item.shipping?.logistic_type === "fulfillment"
              ? "full"
              : "standard",
          seller_name:
            item.seller?.nickname || "Desconhecido",
          seller_reputation: "green",
          product_url: item.permalink,
          image: item.thumbnail
            ? item.thumbnail.replace("-I.jpg", "-O.jpg")
            : "",
        };
      });

      return res.json({
        products: formattedProducts,
      });
    } catch (error: any) {
      console.error(
        "[Search Error]",
        error?.response?.data || error
      );

      return res.status(500).json({
        error: "Failed to fetch from Mercado Livre",
        details: error?.response?.data,
      });
    }
  });

  // =========================
  // FRONTEND
  // =========================
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer().catch(console.error);