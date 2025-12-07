import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { RolUsuario } from '../usuarioEntities/rolUsuario.entity';
import { Auditoria } from '../../comun/entities/auditoria.entity';
import { Pedido } from '../../pedidos/pedidosEntities/pedidos.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Usuario extends Auditoria {
  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellidoPaterno: string;

  @Column({ length: 100 })
  apellidoMaterno: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ci: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100 })
  nombreUsuario: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ default: false })
  verificado: boolean;

  @OneToMany(() => RolUsuario, (usuarioRol) => usuarioRol.usuario)
  roles: RolUsuario[];

  @OneToMany(() => Pedido, (pedido) => pedido.usuario)
  pedidos: Pedido[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.contrasena && !this.contrasena.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.contrasena = await bcrypt.hash(this.contrasena, salt);
    }
  }
}