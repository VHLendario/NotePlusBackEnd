import "reflect-metadata";
import { DataSource } from "typeorm";
import { NotasCorte } from "../Entities/NotasCorte"; 
import { Usuario } from "../Entities/Usuario"; 
import { UsuarioConfig } from "../Entities/UsuarioConfig"; 

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", 
    password: "admin",
    database: "NotasDeCortes",
    synchronize: false, 
    logging: true,    
    entities: [NotasCorte, Usuario, UsuarioConfig],
    migrations: [],
    subscribers: [],
})