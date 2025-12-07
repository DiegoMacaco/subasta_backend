// services/puja.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productosEntities/producto.entity';
import { PujaRepository } from '../productoRepositories/puja';
import { CrearPujaDto } from '../dto/crearpuja';
import { IniciarPujaDto } from '../dto/iniciarpuja';

@Injectable()
export class PujaService {
  constructor(
    private readonly pujaRepo: PujaRepository,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async iniciarPuja(productoId: number, data: IniciarPujaDto) {
    const producto = await this.productoRepo.findOne({
      where: { id: productoId, activo: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.enPuja) {
      throw new BadRequestException('El producto ya está en puja');
    }

    const fechaFin = new Date(data.fechaFinPuja);
    const ahora = new Date();

    if (fechaFin <= ahora) {
      throw new BadRequestException('La fecha de fin debe ser futura');
    }

    // Actualizar producto
    producto.precioInicial = data.precioInicial;
    producto.pujaActual = data.precioInicial;
    producto.incrementoMinimo = data.incrementoMinimo;
    producto.enPuja = true;
    producto.fechaInicioPuja = ahora;
    producto.fechaFinPuja = fechaFin;

    await this.productoRepo.save(producto);

    return {
      mensaje: 'Puja iniciada exitosamente',
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precioInicial: producto.precioInicial,
        incrementoMinimo: producto.incrementoMinimo,
        fechaFinPuja: producto.fechaFinPuja,
      },
    };
  }

  async crearPuja(data: CrearPujaDto) {
    const producto = await this.productoRepo.findOne({
      where: { id: data.productoId, activo: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!producto.enPuja) {
      throw new BadRequestException(
        'Este producto no está disponible para pujar',
      );
    }

    const ahora = new Date();
    if (ahora > producto.fechaFinPuja) {
      throw new BadRequestException('La puja ha finalizado');
    }

    // Calcular monto mínimo
    const montoMinimo =
      Number(producto.pujaActual) + Number(producto.incrementoMinimo);

    if (data.monto < montoMinimo) {
      throw new BadRequestException(
        `El monto debe ser al menos ${montoMinimo.toFixed(2)}. Puja actual: ${producto.pujaActual}, incremento mínimo: ${producto.incrementoMinimo}`,
      );
    }

    // Verificar si el usuario ya tiene la puja más alta
    const ultimaPuja = await this.pujaRepo.findUltimaPuja(data.productoId);
    if (ultimaPuja && ultimaPuja.usuarioId === data.usuarioId) {
      throw new BadRequestException(
        'Ya tienes la puja más alta en este producto',
      );
    }

    // Crear la puja
    const nuevaPuja = await this.pujaRepo.create({
      monto: data.monto,
      usuarioId: data.usuarioId,
      nombreUsuario: data.nombreUsuario,
      productoId: data.productoId,
    });

    // Actualizar producto
    producto.pujaActual = data.monto;
    await this.productoRepo.save(producto);

    return {
      puja: nuevaPuja,
      mensaje: 'Puja realizada exitosamente',
      pujaActual: producto.pujaActual,
      proximoMontoMinimo:
        Number(producto.pujaActual) + Number(producto.incrementoMinimo),
    };
  }

  async obtenerPujasProducto(productoId: number) {
    const producto = await this.productoRepo.findOne({
      where: { id: productoId, activo: true },
      relations: ['subcategoria'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const pujas = await this.pujaRepo.findByProducto(productoId);
    const totalPujas = await this.pujaRepo.countPujasByProducto(productoId);

    const ahora = new Date();
    const pujaFinalizada = producto.enPuja && ahora > producto.fechaFinPuja;

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        subcategoria: producto.subcategoria.nombre,
        precioInicial: producto.precioInicial,
        pujaActual: producto.pujaActual,
        incrementoMinimo: producto.incrementoMinimo,
        fechaInicioPuja: producto.fechaInicioPuja,
        fechaFinPuja: producto.fechaFinPuja,
        enPuja: producto.enPuja,
        pujaFinalizada,
        proximoMontoMinimo: producto.pujaActual
          ? Number(producto.pujaActual) + Number(producto.incrementoMinimo)
          : null,
      },
      pujas,
      totalPujas,
      pujaMasAlta: pujas[0] || null,
    };
  }

  async obtenerPujasUsuario(usuarioId: number) {
    const pujas = await this.pujaRepo.findByUsuario(usuarioId);

    return {
      totalPujas: pujas.length,
      pujas: pujas.map((puja) => ({
        id: puja.id,
        monto: puja.monto,
        fecha: puja.fechaCreacion, // ✔ CAMBIO
        producto: {
          id: puja.producto.id,
          nombre: puja.producto.nombre,
          imagen: puja.producto.imagen,
          pujaActual: puja.producto.pujaActual,
          fechaFinPuja: puja.producto.fechaFinPuja,
          enPuja: puja.producto.enPuja,
        },
        esGanadora: puja.monto === puja.producto.pujaActual,
      })),
    };
  }

  async finalizarPuja(productoId: number) {
    const producto = await this.productoRepo.findOne({
      where: { id: productoId, activo: true },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!producto.enPuja) {
      throw new BadRequestException('El producto no está en puja');
    }

    const ganador = await this.pujaRepo.findUltimaPuja(productoId);
    const totalPujas = await this.pujaRepo.countPujasByProducto(productoId);

    // Finalizar la puja
    producto.enPuja = false;
    await this.productoRepo.save(producto);

    return {
      mensaje: 'Puja finalizada exitosamente',
      resultado: {
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagen,
        },
        precioInicial: producto.precioInicial,
        precioFinal: producto.pujaActual,
        totalPujas,
        ganador: ganador
          ? {
              usuarioId: ganador.usuarioId,
              nombreUsuario: ganador.nombreUsuario,
              montoGanador: ganador.monto,
              fechaPuja: ganador.fechaCreacion, // ✔ CAMBIO
            }
          : null,
      },
    };
  }

  async obtenerProductosEnPuja() {
    const productos = await this.productoRepo.find({
      where: {
        enPuja: true,
        activo: true,
      },
      relations: ['subcategoria'],
      order: { fechaFinPuja: 'ASC' },
    });

    const ahora = new Date();

    return productos.map((producto) => {
      const tiempoRestante = producto.fechaFinPuja.getTime() - ahora.getTime();
      const horasRestantes = Math.max(
        0,
        Math.floor(tiempoRestante / (1000 * 60 * 60)),
      );

      return {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        subcategoria: producto.subcategoria.nombre,
        precioInicial: producto.precioInicial,
        pujaActual: producto.pujaActual,
        incrementoMinimo: producto.incrementoMinimo,
        fechaFinPuja: producto.fechaFinPuja,
        horasRestantes,
        pujaFinalizada: ahora > producto.fechaFinPuja,
      };
    });
  }
}
