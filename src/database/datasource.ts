import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { NotasCorte } from "../Entities/NotasCorte"; 
import { Usuario } from "../Entities/Usuario"; 
import { UsuarioConfig } from "../Entities/UsuarioConfig"; 
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

// Criamos um objeto base com as configurações comuns
const dbConfig: any = {
    type: "postgres",
    synchronize: true, 
    logging: !isProduction,
    entities: [NotasCorte, Usuario, UsuarioConfig],
    migrations: [],
    subscribers: [],
    ssl: isProduction ? { rejectUnauthorized: false } : false,
};

// Se a URL do banco existir (como na Railway), usamos ela
if (process.env.DATABASE_URL) {
    dbConfig.url = process.env.DATABASE_URL;
} else {
    // Se não existir, usamos as credenciais locais
    dbConfig.host = process.env.DB_HOST || "localhost";
    dbConfig.port = Number(process.env.DB_PORT) || 5432;
    dbConfig.username = process.env.DB_USER || "postgres";
    dbConfig.password = process.env.DB_PASS || "admin";
    dbConfig.database = process.env.DB_NAME || "NotasDeCortes";
}

export const AppDataSource = new DataSource(dbConfig as DataSourceOptions);