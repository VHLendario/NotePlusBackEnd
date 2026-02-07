import "reflect-metadata";
import { DataSource } from "typeorm";
import { NotasCorte } from "../Entities/NotasCorte"; // Importe sua entidade aqui

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", // O que está no seu Postgres
    password: "admin",
    database: "NotasDeCortes",
    synchronize: false, // IMPORTANTE: Deixe false para não mexer na estrutura do seu banco pronto
    logging: true,      // Deixe true para ver as consultas SQL no terminal (ajuda a debugar)
    entities: [NotasCorte],
    migrations: [],
    subscribers: [],
})