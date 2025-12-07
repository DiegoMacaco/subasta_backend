import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPujaDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  @Type(() => Number)
  monto: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  productoId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  usuarioId: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  nombreUsuario: string;
}
