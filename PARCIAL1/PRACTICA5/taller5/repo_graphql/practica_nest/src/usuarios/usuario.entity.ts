import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Usuario {
 @PrimaryGeneratedColumn()
 id: number;
 @Column({ length: 100 })
 nombre: string;
 @Column({ unique: true })
 email: string;
 @Column()
 fechaCreacion: Date;
}