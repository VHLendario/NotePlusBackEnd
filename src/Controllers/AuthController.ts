import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { Usuario } from "../Entities/Usuario";

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, senha } = req.body; 
        const repo = AppDataSource.getRepository(Usuario);
        try {
            const usuario = await repo.findOne({ where: { email } });
            if (!usuario || usuario.senha_hash !== senha) {
                return res.status(401).json({ error: "E-mail ou senha inválidos" });
            }

            return res.json({
                token: "token-gerado-pelo-backend",
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        }
    }
}