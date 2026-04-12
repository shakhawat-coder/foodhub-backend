import express, { Application, Request, Response } from "express";
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
import { contactRouter } from "./modules/contact/contact.router";
import { subscriberRouter } from "./modules/subscriber/subscriber.router";
import { couponRouter } from "./modules/coupon/coupon.router";

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
app.use("/contacts", contactRouter);
app.use("/subscribers", subscriberRouter);
app.use("/coupons", couponRouter);

// Welcome route with a modern, centered message
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BookNest | API Welcome</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --bg: #0f172a;
          --text: #f8fafc;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Outfit', sans-serif;
          background: radial-gradient(circle at top left, #1e293b, #0f172a);
          color: var(--text);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.8s ease-out;
        }
        h1 {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.1rem;
          color: #94a3b8;
          max-width: 400px;
          line-height: 1.6;
        }
        .badge {
          display: inline-block;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="glass-card">
        <div class="badge">Backend Active</div>
        <h1>Welcome to FoodHub</h1>
        <p>The core engine of your food delivery system is running smoothly. Ready to serve your requests.</p>
      </div>
    </body>
    </html>
  `);
});

export default app;