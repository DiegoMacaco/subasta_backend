import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productosEntities/producto.entity';
import { SubcategoriaProducto } from '../productosEntities/subcategoriaProductos.entity';

@Injectable()
export class ProductoRepository {
  constructor(
    @InjectRepository(Producto)
    private readonly repository: Repository<Producto>,
    
    @InjectRepository(SubcategoriaProducto)
    private readonly subcategoriaRepository: Repository<SubcategoriaProducto>,
  ) {}

  findAll() {
    return this.repository.find({
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  findAllActive() {
    return this.repository.find({
      where: { activo: true },
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  async create(data: any) {
    console.log('📦 Repository recibió:', data);
    
    // ⭐ CAMBIAR "data.subcategoria" A "data.subcategoriaId"
    const subcategoria = await this.subcategoriaRepository.findOne({
      where: { id: data.subcategoriaId }, // ← Cambio aquí
    });

    if (!subcategoria) {
      throw new NotFoundException(
        `Subcategoría con ID ${data.subcategoriaId} no encontrada`, // ← Cambio aquí
      );
    }

    const producto = this.repository.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      disponibilidad: data.disponibilidad,
      imagen: data.imagen,
      subcategoria: subcategoria, 
    });

    return this.repository.save(producto);
  }

  async update(id: number, data: any) {
    const producto = await this.findById(id);
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (data.subcategoriaId) { 
      const subcategoria = await this.subcategoriaRepository.findOne({
        where: { id: data.subcategoriaId }, 
      });

      if (!subcategoria) {
        throw new NotFoundException(
          `Subcategoría con ID ${data.subcategoriaId} no encontrada`, 
        );
      }

      data.subcategoria = subcategoria; 
      delete data.subcategoriaId; 
    }

    Object.assign(producto, data);
    return this.repository.save(producto);
  }

  async softDelete(id: number) {
    const producto = await this.findById(id);
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    producto.activo = false;
    return this.repository.save(producto);
  }
}