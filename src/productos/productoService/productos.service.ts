import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductoRepository } from '../productoRepositories/producto.repository';
import { CreateProductoDto } from '../dto/crearProducto.dto';

@Injectable()
export class ProductoService {
  constructor(private readonly repo: ProductoRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  findAllActive() {
    return this.repo.findAllActive();
  }

  async findById(id: number) {
    const producto = await this.repo.findById(id);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  create(data: CreateProductoDto & { imagen?: string }) {
    console.log('Datos recibidos en service:', data);
    console.log('Tipo de subcategoriaId:', typeof data.subcategoriaId); // ⭐ Cambio aquí
    return this.repo.create(data);
  }

  update(id: number, data: any) {
    return this.repo.update(id, data);
  }

  async toggleEstado(id: number, activo: boolean) {
    await this.findById(id); // Verificar que existe
    return this.repo.update(id, { activo });
  }

  softDelete(id: number) {
    return this.repo.softDelete(id);
  }
}