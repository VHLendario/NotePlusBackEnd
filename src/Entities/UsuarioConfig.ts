import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("app_configuracoes")
export class UsuarioConfig {
  @PrimaryColumn()
  usuario_id!: number;

  @Column()
  notif_cursos!: boolean;

  @Column()
  notif_atualizacoes!: boolean;

  @Column()
  notif_mensagens!: boolean;

  @Column()
  efeitos_sonoros!: boolean;

  @Column()
  animacoes!: boolean;

  @Column()
  tema!: string;

  @Column()
  idioma!: string;

  @OneToOne(() => Usuario, (usuario) => usuario.configuracoes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;
}