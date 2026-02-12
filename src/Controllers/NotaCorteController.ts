import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { NotasCorte } from "../Entities/NotasCorte";
import { Like, ILike, Raw } from "typeorm";

export class NotasCorteController {
  async search(req: Request, res: Response) {
    const { curso, universidade, cidade, ano, global } = req.query;
    const filtros: any = {};
    const isDetalhes = curso && universidade && global !== 'true';
    const colunasLista: any = {
      id_projeto: true,
      curso: true,
      sigla_universidade: true,
      nome_universidade: true,
      uf_campus: true,
      cidade: true,
      campus: true,
      vagas: true,
      grau: true,
      ano: true
    };

    if (cidade) filtros.cidade = ILike(`%${cidade}%`);
    if (ano) filtros.ano = Number(ano);

    const repo = AppDataSource.getRepository(NotasCorte);
    let whereClause: any;

    // Página de Detalhes
    // Se tenho curso E universidade E NÃO é a busca global da home
    if (curso && universidade && global !== 'true') {
      whereClause = {
        ...filtros,
        curso: curso,
        sigla_universidade: universidade
      };
    }
    // 2. Busca Global (Home)
    else if (global === 'true' && curso) {
      const resultados = await repo
        .createQueryBuilder("nota")
        .select([
          "nota.curso AS curso",
          "nota.sigla_universidade AS sigla_universidade",
          "nota.nome_universidade AS nome_universidade",
          "nota.uf_campus AS uf_campus",
          "nota.campus AS campus",
          "nota.grau AS grau",
          "SUM(nota.vagas) AS vagas"
        ])
        .where(
          `
      unaccent(nota.curso) ILIKE unaccent(:curso)
      OR nota.sigla_universidade ILIKE :curso
      OR nota.nome_universidade ILIKE :curso
      `,
          { curso: `%${curso}%` }
        )
        .groupBy("nota.curso")
        .addGroupBy("nota.sigla_universidade")
        .addGroupBy("nota.nome_universidade")
        .addGroupBy("nota.uf_campus")
        .addGroupBy("nota.campus")
        .addGroupBy("nota.grau")
        .orderBy("vagas", "DESC")
        .limit(100)
        .getRawMany();

      return res.json(resultados);
    }
    // Página de Cursos (apenas curso)
    else if (curso && !universidade) {

      const resultados = await repo
        .createQueryBuilder("nota")
        .select([
          "nota.curso AS curso",
          "nota.sigla_universidade AS sigla_universidade",
          "nota.nome_universidade AS nome_universidade",
          "nota.campus AS campus",
          "nota.grau AS grau",
          "SUM(nota.vagas) AS vagas"
        ])
        .where("unaccent(nota.curso) ILIKE unaccent(:curso)", {
          curso: `%${curso}%`
        })
        .groupBy("nota.curso")
        .addGroupBy("nota.sigla_universidade")
        .addGroupBy("nota.nome_universidade")
        .addGroupBy("nota.campus")
        .addGroupBy("nota.grau")
        .orderBy("vagas", "DESC")
        .limit(100)
        .getRawMany();

      return res.json(resultados);
    }
    // Página de Instituições (apenas universidade)
    else if (universidade) {

      const resultados = await repo
        .createQueryBuilder("nota")
        .select([
          "nota.curso AS curso",
          "nota.sigla_universidade AS sigla_universidade",
          "nota.nome_universidade AS nome_universidade",
          "nota.uf_campus AS uf_campus",
          "nota.campus AS campus",
          "nota.grau AS grau",
          "SUM(nota.vagas) AS vagas"
        ])
        .where(
          `
      nota.sigla_universidade ILIKE :universidade
      OR nota.nome_universidade ILIKE :universidade
      `,
          { universidade: `%${universidade}%` }
        )
        .groupBy("nota.curso")
        .addGroupBy("nota.sigla_universidade")
        .addGroupBy("nota.nome_universidade")
        .addGroupBy("nota.uf_campus")
        .addGroupBy("nota.campus")
        .addGroupBy("nota.grau")
        .orderBy("nota.curso", "ASC")
        .limit(200)
        .getRawMany();

      return res.json(resultados);
    }
    const resultados = await repo.find({
      where: whereClause,
      order: { nota_corte: "DESC" },
      take: 100,
    });

    return res.json(resultados);
  }

  async suggestions(req: Request, res: Response) {
    const { curso, universidade } = req.query;

    if (!curso && !universidade) return res.json([]);

    const repo = AppDataSource.getRepository(NotasCorte);

    try {
      const query = repo.createQueryBuilder("nota");

      if (universidade) {
        // Busca por SIGLA ou NOME da universidade
        const unis = await query
          .select("DISTINCT(nota.sigla_universidade)", "sigla")
          .where("nota.sigla_universidade ILIKE :termo", { termo: `%${universidade}%` })
          .orWhere("nota.nome_universidade ILIKE :termo", { termo: `%${universidade}%` })
          .limit(10)
          .getRawMany();

        return res.json(unis.map(u => u.sigla));
      }

      if (curso) {
        // Busca por NOME do curso (com unaccent)
        const cursos = await query
          .select("DISTINCT(nota.curso)", "curso")
          .where("unaccent(nota.curso) ILIKE unaccent(:termo)", { termo: `%${curso}%` })
          .limit(10)
          .getRawMany();

        return res.json(cursos.map(c => c.curso));
      }

    } catch (error) {
      console.error("Erro no Banco:", error);
      return res.status(500).json({ error: "Erro ao buscar sugestões" });
    }
  }
}