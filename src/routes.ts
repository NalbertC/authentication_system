import { Router } from "express";
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";

const routes = Router();

routes.get("/", (req, res) => {
  return res.status(200).json("Olá mundo");
});

// login
routes.post("/session", SessionController.create);

// user
routes.post("/users", UserController.create);
routes.get("/users", UserController.index);
routes.get("/users/:user_id", UserController.user);

export { routes };
