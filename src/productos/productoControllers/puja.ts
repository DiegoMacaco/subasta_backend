import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PujaService } from '../productoService/puja';
import { CrearPujaDto } from '../dto/crearpuja';
import { IniciarPujaDto } from '../dto/iniciarpuja';

@Controller('pujas')
export class PujaController {
  constructor(private readonly pujaService: PujaService) {}

  // Iniciar puja en un producto
  @Post('iniciar/:productoId')
  async iniciarPuja(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Body() data: IniciarPujaDto,
  ) {
    return await this.pujaService.iniciarPuja(productoId, data);
  }

  // Crear una nueva puja
  @Post()
  async crearPuja(@Body() data: CrearPujaDto) {
    return await this.pujaService.crearPuja(data);
  }

  // Obtener todas las pujas de un producto
  @Get('producto/:productoId')
  async obtenerPujasProducto(
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return await this.pujaService.obtenerPujasProducto(productoId);
  }

  // Obtener pujas de un usuario
  @Get('usuario/:usuarioId')
  async obtenerPujasUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return await this.pujaService.obtenerPujasUsuario(usuarioId);
  }

  // Finalizar puja de un producto
  @Patch('finalizar/:productoId')
  async finalizarPuja(@Param('productoId', ParseIntPipe) productoId: number) {
    return await this.pujaService.finalizarPuja(productoId);
  }

  // Listar todos los productos en puja
  @Get('activas')
  async obtenerProductosEnPuja() {
    return await this.pujaService.obtenerProductosEnPuja();
  }
}
