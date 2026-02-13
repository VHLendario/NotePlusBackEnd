import express from "express";
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import routes from "./routes";

AppDataSource.initialize().then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(routes);

    const PORT = process.env.PORT || 3333;

    app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Servidor rodando na porta ${PORT} e Banco Conectado!`);
    });
}).catch(error => console.log("Erro ao conectar no banco:", error));