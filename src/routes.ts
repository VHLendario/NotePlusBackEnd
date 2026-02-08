import { Router } from "express";
import { NotasCorteController } from "./Controllers/NotaCorteController";

const controller = new NotasCorteController();
const routes = Router();

routes.get("/pesquisar", new NotasCorteController().search);
routes.get("/sugestoes", controller.suggestions);

export default routes;