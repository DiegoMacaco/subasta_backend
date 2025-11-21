import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtenemos el DataSource de TypeORM
  const dataSource = app.get(DataSource);

  // try {
  //   console.log('Ejecutando seeds...');
  //   console.log('Seeds ejecutadas correctamente!');
  // } catch (error) {
  //   console.error('Error ejecutando seeds:', error);
  // }

  await app.listen(3000);
  console.log('Servidor corriendo en http://localhost:3000');
}
bootstrap();
