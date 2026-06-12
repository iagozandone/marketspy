import "dotenv/config";
import express from "express";
import { createServer } from "http";
import axios from "axios";

// Mercado Livre Credentials
const ML_CLIENT_ID = process.env.ML_CLIENT_ID!;
const ML_CLIENT_SECRET = process.env.ML_CLIENT_SECRET!;
const ML_REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN!;

const COMMON_HEADERS = {
  "Accept": "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "User-Agent": "MarketSpy/1.0 (Node.js; AxiosClient)"
};

const app = express();
const server = createServer(app);

app.use(express.json());

// CORS Middleware
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

// Helper function to get Access Token
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
          ...COMMON_HEADERS,
        },
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error("[ML Token Error]", error?.response?.data || error.message);
    throw new Error("Failed to get access token from Mercado Livre");
  }
}

// Route: Test ML Connection
app.get("/api/test-ml", async (_req, res) => {
  try {
    const accessToken = await getAccessToken();
    const userResponse = await axios.get(
      "https://api.mercadolibre.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...COMMON_HEADERS,
        },
      }
    );

    return res.json({
      success: true,
      token_valid: true,
      user: userResponse.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error?.response?.data
    });
  }
});

// Route: Search Products (Now Authenticated to avoid 403)
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    console.log(`[AUTHENTICATED SEARCH] ${q}`);

    // Get a fresh access token for the search
    const accessToken = await getAccessToken();

    const mlResponse = await axios.get(
      `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(
        q as string
      )}&limit=20`,
      {
        headers: {
          ...COMMON_HEADERS,
          Authorization: `Bearer ${accessToken}` // Crucial to avoid 403
        },
      }
    );

    const results = mlResponse.data.results || [];

    const formattedProducts = results.map((item: any) => {
      const mockDaysOnline = Math.floor(Math.random() * 150) + 10;
      const actualSales = item.sold_quantity || Math.floor(Math.random() * 100);
      const salesPerDay = parseFloat((actualSales / mockDaysOnline).toFixed(1));

      return {
        id: `ml-${item.id}`,
        title: item.title,
        price: item.price,
        product_id: item.id,
        page_found: 1,
        visits_last_7_days: Math.floor(Math.random() * 2000) + 50,
        days_online: mockDaysOnline,
        sales_per_day: salesPerDay,
        sales_per_week: parseFloat((salesPerDay * 7).toFixed(1)),
        total_sales: actualSales,
        listing_type: item.listing_type_id === "gold_pro" ? "catalog" : "organic",
        logistics_type: item.shipping?.logistic_type === "fulfillment" ? "full" : "standard",
        seller_name: item.seller?.nickname || "Desconhecido",
        seller_reputation: "green",
        product_url: item.permalink,
        image: item.thumbnail ? item.thumbnail.replace("-I.jpg", "-O.jpg") : "",
      };
    });

    return res.json({ products: formattedProducts });
  } catch (error: any) {
    console.error("[Search Error]", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      success: false,
      error: "Failed to fetch from Mercado Livre",
      details: error?.response?.data || error.message,
    });
  }
});

// Production handling is managed by Vercel's edge/serverless infrastructure
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

export default app;
