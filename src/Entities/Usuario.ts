import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UsuarioConfig } from "./UsuarioConfig";

@Entity("app_usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  email!: string;

  @Column()
  senha_hash!: string;

  @Column()
  avatar_url!: string;

  @Column()
  buscas_realizadas!: number;

  @Column()
  limite_buscas!: number;

  @OneToOne(() => UsuarioConfig, (config) => config.usuario)
  configuracoes!: UsuarioConfig;
}