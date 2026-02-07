import { Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { NotasCorte } from "../Entities/NotasCorte";
import { Like, ILike } from "typeorm";

export class NotasCorteController {
  async search(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(NotasCorte);

      // Pegamos os filtros que vêm da URL (ex: /pesquisar?curso=Direito)
      const { curso, universidade, cidade, ano } = req.query;

      // Montamos o objeto de filtro dinamicamente
      const filtros: any = {};

      /* http://localhost:3333/pesquisar?curso=CIÊNCIA DA COMPUTAÇÃO */
      if (universidade) {
        filtros.sigla_universidade = ILike(`%${universidade}%`);
      }
      if (cidade) {
        filtros.cidade = ILike(`%${cidade}%`);
      }
      if (ano) {
        filtros.ano = Number(ano);
      }

      // Faz a busca no banco
      const resultados = await repo.find({
        where: filtros,
        order: {
          nota_corte: "DESC", // Mostra as maiores notas primeiro
        },
        take: 100, // Limita a 100 resultados para não travar o front
      });

      return res.json(resultados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
}