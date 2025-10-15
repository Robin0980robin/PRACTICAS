import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Receta } from "./Receta";
import { Busqueda } from "./Busqueda";

@Entity()
export class DetalleReceta {
  @PrimaryGeneratedColumn()
  id_detalle_receta!: number;

  @Column()
  id_producto!: number;

  @Column()
  cantidad!: number;

  @Column()
  dosis!: string;

  @Column()
  presentacion!: string;

  @Column()
  duracion_tratamiento!: string;

  @Column()
  instrucciones!: string;

  @ManyToOne(() => Receta, (receta) => receta.detalles, { onDelete: "CASCADE" })
  receta!: Receta;

  @ManyToOne(() => Busqueda, (busqueda) => busqueda.detalles, { onDelete: "CASCADE" })
  busqueda!: Busqueda;
}
