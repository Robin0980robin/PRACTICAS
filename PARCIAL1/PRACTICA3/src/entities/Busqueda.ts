import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DetalleReceta } from "./DetalleReceta";

@Entity()
export class Busqueda {
  @PrimaryGeneratedColumn()
  id_busqueda!: number;

  @Column()
  termino_busqueda!: string;

  @Column()
  fecha_hora!: Date;

  @Column()
  resultados_mostrados!: number;

  @Column()
  farmacia_seleccionada!: string;

  @Column()
  geolocalizacion!: string;

  @OneToMany(() => DetalleReceta, (detalle) => detalle.busqueda)
  detalles!: DetalleReceta[];
}
