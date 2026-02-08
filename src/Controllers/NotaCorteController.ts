import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { NotasCorte } from "../Entities/NotasCorte";
import { Like, ILike, Raw } from "typeorm";

export class NotasCorteController {
  async search(req: Request, res: Response) {
    const { curso, universidade, cidade, ano } = req.query;
    const filtros: any = {};

    // Só adiciona ao objeto de filtro se existir valor e não for string vazia
    if (curso && curso !== "") {
      // Isso remove os acentos tanto do que está no banco quanto do que o usuário digitou
      filtros.curso = Raw((alias) => `unaccent(${alias}) ILIKE unaccent('%${curso}%')`);
    }

    if (universidade && universidade !== "") {
      filtros.sigla_universidade = ILike(`%${universidade}%`);
    }

    if (cidade && cidade !== "") {
      filtros.cidade = ILike(`%${cidade}%`);
    }

    if (ano && ano !== "") {
      filtros.ano = Number(ano); // Converte "2025" para 2025
    }

    const repo = AppDataSource.getRepository(NotasCorte);
    const resultados = await repo.find({
      where: filtros,
      order: {
        nota_corte: "DESC",
      },
      take: 100,
    });

    return res.json(resultados);
  }

  async suggestions(req: Request, res: Response) {
    const { curso } = req.query;
    if (!curso) return res.json([]); // Evita erro se o curso vier vazio

    const repo = AppDataSource.getRepository(NotasCorte);

    try {
      const cursos = await repo
        .createQueryBuilder("nota")
        .select("DISTINCT(nota.curso)", "curso")
        .where("unaccent(nota.curso) ILIKE unaccent(:termo)", { termo: `%${curso}%` })
        .limit(10)
        .getRawMany();

      // No getRawMany, o nome da chave costuma vir exatamente como no SELECT
      const listaNomes = cursos.map(c => c.curso);
      console.log("Sugestões encontradas:", listaNomes); // Debug no console do terminal
      return res.json(listaNomes);
    } catch (error) {
      console.error("Erro no Banco:", error);
      return res.status(500).json({ error: "Erro ao buscar sugestões" });
    }
  }
}