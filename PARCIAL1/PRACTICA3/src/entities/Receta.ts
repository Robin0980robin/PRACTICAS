import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DetalleReceta } from "./DetalleReceta";

@Entity()
export class Receta {
  @PrimaryGeneratedColumn()
  id_receta!: number;

  @Column()
  fecha_emision!: Date;

  @Column()
  diagnostico!: string;

  @Column()
  observaciones!: string;

  @Column()
  ubicacion_emision!: string;

  @OneToMany(() => DetalleReceta, (detalle) => detalle.receta)
  detalles!: DetalleReceta[];
}
