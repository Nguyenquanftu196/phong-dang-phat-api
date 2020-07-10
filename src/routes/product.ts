import { Application } from "express";
import { ProductController } from "../controllers/product";

export default (app: Application) => {
  app.post("/product", ProductController.create)
  app.delete("/product/:id", ProductController.delete)
  app.get("/product/:id", ProductController.fetch)
  app.put("/product/:id", ProductController.edit)
};
