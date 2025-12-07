import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductoService } from '../productoService/productos.service';
import { CreateProductoDto } from '../dto/crearProducto.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('activos')
  findAllActive() {
    return this.service.findAllActive();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen'))
  create(
    @UploadedFile() file: any,
    @Body() body: CreateProductoDto,
  ) {
    console.log('═══════════════════════════════════');
    console.log('Body recibido:', body);
    console.log('Tipos:');
    console.log('   nombre:', typeof body.nombre, '→', body.nombre);
    console.log('   precio:', typeof body.precio, '→', body.precio);
    console.log('   disponibilidad:', typeof body.disponibilidad, '→', body.disponibilidad);
    console.log('   subcategoriaId:', typeof body.subcategoriaId, '→', body.subcategoriaId); // ← Cambio aquí
    console.log('Archivo:', file?.filename);
    console.log('═══════════════════════════════════');

    if (!body.subcategoriaId) { // ← Cambio aquí
      throw new BadRequestException('La subcategoría es requerida');
    }

    const subcategoriaId = Number(body.subcategoriaId); // ← Cambio aquí
    if (isNaN(subcategoriaId)) {
      throw new BadRequestException('La subcategoría debe ser un número válido');
    }

    return this.service.create({
      ...body,
      subcategoriaId: subcategoriaId, // ← Cambio aquí
      imagen: file?.filename ?? null,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() imagen: any,
    @Body() data: any,
  ) {
    if (data.subcategoriaId) { // ← Cambio aquí
      data.subcategoriaId = Number(data.subcategoriaId); // ← Cambio aquí
    }

    return this.service.update(id, {
      ...data,
      imagen: imagen ? imagen.filename : undefined,
    });
  }

  @Patch(':id/estado')
  toggleEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('activo') activo: boolean,
  ) {
    return this.service.toggleEstado(id, activo);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }
}