import { Entity, ManyToOne, Unique } from 'typeorm';
import { Auditoria } from '../../comun/entities/auditoria.entity';
import { Usuario } from '../usuarioEntities/usuario.entity';
import { Rol } from '../usuarioEntities/rol.entity';

@Entity()
@Unique(['usuario', 'rol'])
export class RolUsuario extends Auditoria {
  @ManyToOne(() => Usuario, (usuario) => usuario.roles, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { onDelete: 'CASCADE' })
  rol: Rol;
}
