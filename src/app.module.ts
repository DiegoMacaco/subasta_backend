import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/configorm/configorm';

import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    UsuariosModule,
  ],
})
export class AppModule {}
