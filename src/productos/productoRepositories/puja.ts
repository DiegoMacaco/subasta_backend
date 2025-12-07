import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puja } from '../productosEntities/puja.entity';

@Injectable()
export class PujaRepository {
  constructor(
    @InjectRepository(Puja)
    private readonly pujaRepo: Repository<Puja>,
  ) {}

  async create(data: Partial<Puja>): Promise<Puja> {
    const puja = this.pujaRepo.create(data);
    return await this.pujaRepo.save(puja);
  }

  async findByProducto(productoId: number): Promise<Puja[]> {
    return await this.pujaRepo.find({
      where: {
        productoId,
        activo: true,
      },
      order: {
        monto: 'DESC',
        fechaCreacion: 'DESC',
      },
    });
  }

  async findUltimaPuja(productoId: number): Promise<Puja | null> {
    return await this.pujaRepo.findOne({
      where: {
        productoId,
        activo: true,
      },
      order: {
        monto: 'DESC',
        fechaCreacion: 'DESC',
      },
    });
  }

  async findByUsuario(usuarioId: number): Promise<Puja[]> {
    return await this.pujaRepo.find({
      where: {
        usuarioId,
        activo: true,
      },
      relations: ['producto', 'producto.subcategoria'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async countPujasByProducto(productoId: number): Promise<number> {
    return await this.pujaRepo.count({
      where: {
        productoId,
        activo: true,
      },
    });
  }

  async findPujasByUsuarioYProducto(
    usuarioId: number,
    productoId: number,
  ): Promise<Puja[]> {
    return await this.pujaRepo.find({
      where: {
        usuarioId,
        productoId,
        activo: true,
      },
      order: { fechaCreacion: 'DESC' },
    });
  }
}
