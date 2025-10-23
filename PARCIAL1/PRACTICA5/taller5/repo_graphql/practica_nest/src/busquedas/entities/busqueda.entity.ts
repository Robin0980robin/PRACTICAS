import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Farmacia } from '../../farmacias/entities/farmacia.entity';

@Entity('busquedas')
export class Busqueda {
    @PrimaryGeneratedColumn()
    id_busqueda: number;

    @Column()
    termino_busqueda: string;

    @Column({ type: 'datetime' })
    fecha_hora: Date;

    @Column()
    resultados_mostrados: string;

    @Column()
    farmacia_seleccionada: string;

    @Column()
    geolocalizacion: string;

    @ManyToOne(() => Usuario, usuario => usuario.busquedas)
    usuario: Usuario;

    @ManyToOne(() => Farmacia, farmacia => farmacia.busquedas)
    farmacia: Farmacia;
}
