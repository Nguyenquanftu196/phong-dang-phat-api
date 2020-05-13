import { Application } from "express";
import { UserController } from "../controllers/users";

export default (app: Application) => {
  app.post("/user", UserController.create)
  app.delete("/user/:id", UserController.remove);
  app.put("/user/me", UserController.adminUpdate);
  app.get("/users", UserController.list);
};
