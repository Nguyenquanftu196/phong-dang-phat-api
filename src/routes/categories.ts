import { Application } from "express";
import { CategoriesController } from "../controllers/categories";

export default (app: Application) => {
  app.post("/category", CategoriesController.create)
  app.put("/category/:id", CategoriesController.update)
  app.delete("/category/:id", CategoriesController.delete)
};
