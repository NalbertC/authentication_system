import { Router } from "express";
import ProductController from "./controllers/ProductController";
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import { ensureAuthenticated } from "./middlewares/authentication";

const routes = Router();

routes.get("/", (req, res) => {
  return res.status(200).json("Olá mundo");
});

// login
routes.post("/login", SessionController.create);

// user
routes.post("/users", UserController.create);
routes.get("/users", UserController.index);
routes.get("/users/:user_id", ensureAuthenticated, UserController.user);

// product
routes.post("/products", ProductController.create);
routes.get("/products", ProductController.index);


export { routes };
