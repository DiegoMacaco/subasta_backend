import { IsNumber, IsPositive, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class IniciarPujaDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01, { message: 'El precio inicial debe ser mayor a 0' })
  @Type(() => Number)
  precioInicial: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01, { message: 'El incremento mínimo debe ser mayor a 0' })
  @Type(() => Number)
  incrementoMinimo: number;

  @IsDateString({}, { message: 'La fecha de fin debe ser válida' })
  fechaFinPuja: string;
}
