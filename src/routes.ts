import { Router } from "express";
import { NotasCorteController } from "./Controllers/NotaCorteController";
import { UsuarioController } from "./Controllers/UsuarioController";
import { AuthController } from "./Controllers/AuthController";

const usuarioController = new UsuarioController();
const controller = new NotasCorteController();
const routes = Router();

routes.get("/pesquisar", new NotasCorteController().search);
routes.get("/sugestoes", controller.suggestions);
routes.get("/usuario/:id", usuarioController.getProfile);
routes.put("/usuario/:id", usuarioController.updateProfile);
routes.post("/usuarios", usuarioController.create);
routes.delete("/usuario/:id", usuarioController.delete);
routes.post("/login", new AuthController().login);
routes.get("/stats", (req, res) => new UsuarioController().getDashboardStats(req, res));

export default routes;