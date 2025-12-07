import { Auditoria } from 'src/comun/entities/auditoria.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SubcategoriaProducto } from './subcategoriaProductos.entity';
import { Puja } from './puja.entity';

@Entity()
export class Producto extends Auditoria {
  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int', nullable: true })
  disponibilidad: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen: string | null;

  @ManyToOne(() => SubcategoriaProducto, (subcat) => subcat.productos, {
    eager: true,
    nullable: false,
  })
  subcategoria: SubcategoriaProducto;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioInicial: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pujaActual: number;

  @Column('decimal', { precision: 10, scale: 2, default: 1.0 })
  incrementoMinimo: number;

  @Column({ type: 'boolean', default: false })
  enPuja: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaInicioPuja: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFinPuja: Date;

  @OneToMany(() => Puja, (puja) => puja.producto)
  pujas: Puja[];
}
