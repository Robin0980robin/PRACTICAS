import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
