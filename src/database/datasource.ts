import "reflect-metadata";
import { DataSource } from "typeorm";
import { NotasCorte } from "../Entities/NotasCorte"; 
import { Usuario } from "../Entities/Usuario"; 
import { UsuarioConfig } from "../Entities/UsuarioConfig"; 
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST as string,
    port: Number(process.env.TYPEORM_PORT) || 5432,
    username: process.env.TYPEORM_USERNAME as string,
    password: process.env.TYPEORM_PASSWORD as string,
    database: process.env.TYPEORM_DATABASE as string,
    synchronize: false, 
    logging: true,    
    entities: [NotasCorte, Usuario, UsuarioConfig],
    migrations: [],
    subscribers: [],
    extra: {
        ssl: false
    }
})