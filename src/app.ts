import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import { categoryRouter } from "./modules/category/category.router";
import { mealRouter } from "./modules/meal/meal.router";
import { cartRouter } from "./modules/cart/cart.router";
import { providerRouter } from "./modules/provider/provider.router";
import { orderRouter } from "./modules/order/order.router";
import { usersRouter } from "./modules/users/users.router";
import { reviewRouter } from "./modules/review/review.router";
import { uploadRouter } from "./modules/upload/upload.router";
import { bannerRouter } from "./modules/banner/banner.router";
import { riderRouter } from "./modules/rider/rider.router";
import { managerRouter } from "./modules/manager/manager.router";
import { customAuthRouter } from "./modules/auth/auth.router";
import { searchRouter } from "./modules/search/search.router";
import { analyticsRouter } from "./modules/analytics/analytics.router";
import { aiInsightsRouter } from "./modules/ai-insights/ai-insights.router";
import { blogRouter } from "./modules/blog/blog.router";

const app: Application = express();
app.set("trust proxy", 1);

const corsOrigins = [
  process.env.APP_URL,
  "http://localhost:3000",
  "https://foodhub-frontend-mu.vercel.app",
  ...(process.env.CORS_ORIGINS?.split(",").map((s) => s.trim()) ?? []),
].filter((o): o is string => Boolean(o));

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/auth", customAuthRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/meal", mealRouter);
app.use("/cart", cartRouter);
app.use("/provider", providerRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
app.use("/upload", uploadRouter);
app.use("/banner", bannerRouter);
app.use("/rider", riderRouter);
app.use("/manager", managerRouter);
app.use("/ai-search", searchRouter);
app.use("/analytics", analyticsRouter);
app.use("/ai-insights", aiInsightsRouter);
app.use("/blogs", blogRouter);

app.get("/", (req, res) => {
  res.send("Welcome to FoodHub Backend");
});

export default app;