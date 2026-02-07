import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("NotasDeCortes") // Substitua pelo nome real no Postgres
export class NotasCorte {
  @PrimaryGeneratedColumn({name: 'id_projeto'})
  id_projeto!: number; // Se não tiver ID, use uma composta ou crie um serial no banco

  @Column ({name: 'CO_IES'})
  codigo_instituicao!: number

  @Column({name: 'EDICAO'})
  ano!: number;

  @Column({name: 'NO_IES'})
  nome_universidade!: string;

  @Column({name: 'SG_IES'})
  sigla_universidade!: string;

  @Column({name: 'NO_CAMPUS'})
  campus!: string;

  @Column({name: 'NO_MUNICIPIO_CAMPUS'})
  cidade!: string;

  @Column({name: 'NO_CURSO'})
  curso!: string;

  @Column({name: 'TIPO_CONCORRENCIA'})
  modalidade!: string; // Ex: "LB_PPI", "AC"

  @Column({name: 'DS_MOD_CONCORRENCIA'})
  descricao_cota!: string;

  @Column({ 
    type: "decimal", 
    name: 'NU_NOTACORTE',
    transformer: {
      from: (value: string) => value ? parseFloat(value.replace(',', '.')) : 0,
      to: (value: number) => value
    }
  })
  nota_corte!: number;
}