import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuarioEntities/usuario.entity';
import { Rol } from './usuarioEntities/rol.entity';
import { RolUsuario } from './usuarioEntities/rolUsuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(RolUsuario)
    private rolUsuarioRepository: Repository<RolUsuario>,
  ) {}

  async registrar(crearUsuarioDto: CrearUsuarioDto): Promise<any> {

    const correoExistente = await this.usuarioRepository.findOne({
      where: { correo: crearUsuarioDto.correo },
    });

    if (correoExistente) {
      throw new ConflictException('El correo ya está registrado');
    }


    const nombreUsuario = `${crearUsuarioDto.nombre.toLowerCase()}.${crearUsuarioDto.apellidoPaterno.toLowerCase()}`;


    const contrasenaHasheada = await bcrypt.hash(crearUsuarioDto.contrasena, 10);


    const nuevoUsuario = this.usuarioRepository.create({
      nombre: crearUsuarioDto.nombre,
      apellidoPaterno: crearUsuarioDto.apellidoPaterno,
      apellidoMaterno: crearUsuarioDto.apellidoMaterno,
      correo: crearUsuarioDto.correo,
      telefono: crearUsuarioDto.telefono,
      nombreUsuario,
      contrasena: contrasenaHasheada,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);


    let rolCliente = await this.rolRepository.findOne({
      where: { nombre: 'Cliente' },
    });

    if (!rolCliente) {
      rolCliente = await this.rolRepository.save({
        nombre: 'Cliente',
        descripcion: 'Rol de cliente por defecto',
      });
    }
    await this.rolUsuarioRepository.save({
      usuario: usuarioGuardado,
      rol: rolCliente,
    });

    const { contrasena, ...resultado } = usuarioGuardado;
    return resultado;
  }

  async login(loginUsuarioDto: LoginUsuarioDto): Promise<any> {
    const { correo, contrasena } = loginUsuarioDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { correo },
      relations: ['roles', 'roles.rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esContrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    return {
      ...usuarioSinContrasena,
      roles: usuario.roles.map((ru) => ru.rol.nombre),
    };
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['roles', 'roles.rol'],
      select: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'nombreUsuario'],
    });
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.rol'],
      select: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'nombreUsuario'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async actualizar(id: number, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.obtenerPorId(id);

    if (actualizarUsuarioDto.contrasena) {
      actualizarUsuarioDto.contrasena = await bcrypt.hash(actualizarUsuarioDto.contrasena, 10);
    }

    if (actualizarUsuarioDto.correo && actualizarUsuarioDto.correo !== usuario.correo) {
      const correoExistente = await this.usuarioRepository.findOne({
        where: { correo: actualizarUsuarioDto.correo },
      });

      if (correoExistente) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    Object.assign(usuario, actualizarUsuarioDto);
    const usuarioActualizado = await this.usuarioRepository.save(usuario);

    const { contrasena, ...resultado } = usuarioActualizado;
    return resultado as Usuario;
  }

  async eliminar(id: number): Promise<void> {
    const usuario = await this.obtenerPorId(id);
    await this.usuarioRepository.remove(usuario);
  }

  async asignarRol(usuarioId: number, rolNombre: string): Promise<void> {
    const usuario = await this.obtenerPorId(usuarioId);

    const rol = await this.rolRepository.findOne({
      where: { nombre: rolNombre },
    });

    if (!rol) {
      throw new NotFoundException(`Rol ${rolNombre} no encontrado`);
    }

    const rolExistente = await this.rolUsuarioRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        rol: { id: rol.id },
      },
    });

    if (rolExistente) {
      return; 
    }

    await this.rolUsuarioRepository.save({
      usuario,
      rol,
    });
  }
}