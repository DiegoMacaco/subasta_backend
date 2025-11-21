import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuarioEntities/usuario.entity';
import { Rol } from './usuarioEntities/rol.entity';
import { RolUsuario } from './usuarioEntities/rolUsuario.entity'; 



@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, RolUsuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
