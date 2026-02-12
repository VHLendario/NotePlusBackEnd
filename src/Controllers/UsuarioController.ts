import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { Usuario } from "../Entities/Usuario";
/* import { UsuarioConfig } from "../Entities/UsuarioConfig"; */
import { NotasCorte } from "../Entities/NotasCorte";

export class UsuarioController {
    async getProfile(req: Request, res: Response) {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Usuario);

        try {
            const usuario = await repo.findOne({
                where: { id: Number(id) },
                relations: ["configuracoes"]
            });
            if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
            return res.json(usuario);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar perfil" });
        }
    }

    async updateProfile(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, email, avatar_url, senha_hash } = req.body;
        const repo = AppDataSource.getRepository(Usuario);

        if (!id) {
            return res.status(400).json({ error: "ID não fornecido" });
        }

        try {
            const updateData: any = {};
            if (nome) updateData.nome = nome;
            if (email) updateData.email = email;
            if (avatar_url) updateData.avatar_url = avatar_url;
            if (senha_hash) updateData.senha_hash = senha_hash;

            await repo.update(Number(id), updateData);

            return res.json({ message: "Perfil atualizado com sucesso!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar" });
        }
    }

    async create(req: Request, res: Response) {
        const { nome, email, senha } = req.body;
        const repo = AppDataSource.getRepository(Usuario);

        try {
            const userExists = await repo.findOneBy({ email });
            if (userExists) return res.status(400).json({ error: "Email já cadastrado" });

            const novoUsuario = repo.create({
                nome,
                email,
                senha_hash: senha
            });

            await repo.save(novoUsuario);

            return res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar conta" });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Usuario);

        try {
            const usuario = await repo.findOneBy({ id: Number(id) });

            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado para exclusão." });
            }

            await repo.remove(usuario);

            return res.json({ message: "Conta deletada com sucesso. Sentiremos sua falta!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro interno ao deletar a conta." });
        }
    }

    async getDashboardStats(req: Request, res: Response) {
        const repo = AppDataSource.getRepository(NotasCorte);

        try {
            const stats = await repo
                .createQueryBuilder("nota")
                .select("COUNT(DISTINCT nota.curso)", "totalCursos")
                .addSelect("COUNT(DISTINCT nota.codigo_instituicao)", "totalFaculdades")
                .addSelect("COUNT(DISTINCT nota.uf_campus)", "totalEstados")
                .getRawOne();

            const totalCursos = parseInt(stats.totalCursos);
            const totalFaculdades = parseInt(stats.totalFaculdades);
            const totalEstados = parseInt(stats.totalEstados) || 0;

            const mediaCursos = totalFaculdades > 0
                ? (totalCursos / totalFaculdades).toFixed(1)
                : 0;
            return res.json({
                totalCursos,
                totalFaculdades,
                totalEstados,
                mediaCursos
            });
        } catch (error) {
            console.error("Erro no Dashboard:", error);
            return res.status(500).json({ error: "Erro ao buscar estatísticas" });
        }
    }
}