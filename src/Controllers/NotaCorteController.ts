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

    // 1. PRIORIDADE MÁXIMA: Página de Detalhes
    // Se tenho curso E universidade E NÃO é a busca global da home
    if (curso && universidade && global !== 'true') {
      whereClause = {
        ...filtros,
        curso: curso, // Busca exata (evita o "OR" que duplica)
        sigla_universidade: universidade
      };
    }
    // 2. PRIORIDADE MÉDIA: Busca Global (Home)
    else if (global === 'true' && curso) {
      whereClause = [
        { ...filtros, curso: Raw((alias) => `unaccent(${alias}) ILIKE unaccent('%${curso}%')`) },
        { ...filtros, sigla_universidade: ILike(`%${curso}%`) },
        { ...filtros, nome_universidade: ILike(`%${curso}%`) }
      ];
    }
    // 3. PRIORIDADE BAIXA: Página de Cursos (apenas curso)
    else if (curso && !universidade) {
      whereClause = {
        ...filtros,
        curso: Raw((alias) => `unaccent(${alias}) ILIKE unaccent('%${curso}%')`)
      };
    }
    // 4. PRIORIDADE BAIXA: Página de Instituições (apenas universidade)
    else if (universidade) {
      whereClause = [
        { ...filtros, sigla_universidade: ILike(`%${universidade}%`) },
        { ...filtros, nome_universidade: ILike(`%${universidade}%`) }
      ];
    } else {
      whereClause = filtros;
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