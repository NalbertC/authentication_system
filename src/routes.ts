import { Router } from "express";
import ProductController from "./controllers/ProductController";
import RedefinePassController from "./controllers/RedefinePassController";
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
routes.get("/users/user", ensureAuthenticated, UserController.user);

// product
routes.post("/products", ensureAuthenticated, ProductController.create);
routes.get("/products", ProductController.index);

// forgot password
routes.post("/forgot_pass", RedefinePassController.forgot);
routes.post("/reset_pass/:token", RedefinePassController.reset);

export { routes };
