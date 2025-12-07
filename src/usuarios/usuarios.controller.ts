import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe, 
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async registrar(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.registrar(crearUsuarioDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  @Get()
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) { 
    return this.usuariosService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number, 
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(id, actualizarUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseIntPipe) id: number) { 
    await this.usuariosService.eliminar(id);
  }

  @Post(':id/roles/:rolNombre')
  @HttpCode(HttpStatus.OK)
  async asignarRol(
    @Param('id', ParseIntPipe) id: number, 
    @Param('rolNombre') rolNombre: string,
  ) {
    await this.usuariosService.asignarRol(id, rolNombre);
    return { mensaje: 'Rol asignado correctamente' };
  }
}