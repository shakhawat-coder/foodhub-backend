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

const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/meal", mealRouter);
app.use("/cart", cartRouter);
app.use("/provider", providerRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
app.use("/upload", uploadRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
