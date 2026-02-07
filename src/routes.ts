import { Router } from "express";
import { NotasCorteController } from "./Controllers/NotaCorteController";

const routes = Router();

// Aqui chamamos o método de pesquisa que vamos criar no controller
routes.get("/pesquisar", new NotasCorteController().search);

export default routes;