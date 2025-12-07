// entities/puja.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Auditoria } from 'src/comun/entities/auditoria.entity';
import { Producto } from './producto.entity';

@Entity()
export class Puja extends Auditoria {
  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'int' })
  usuarioId: number; // O usar una relación si tienes entidad Usuario

  @Column({ length: 100 })
  nombreUsuario: string;

  @ManyToOne(() => Producto, (producto) => producto.pujas, {
    nullable: false,
  })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @Column({ type: 'int' })
  productoId: number;
}
