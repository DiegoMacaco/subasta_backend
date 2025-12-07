import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puja } from './productosEntities/puja.entity';
import { Producto } from '../productos/productosEntities/producto.entity';
import { PujaService } from '../productos/productoService/puja';
import { PujaRepository } from '../productos/productoRepositories/puja';
import { PujaController } from '../productos/productoControllers/puja';

@Module({
  imports: [TypeOrmModule.forFeature([Puja, Producto])],
  controllers: [PujaController],
  providers: [PujaService, PujaRepository],
  exports: [PujaService, PujaRepository],
})
export class PujaModule {}
