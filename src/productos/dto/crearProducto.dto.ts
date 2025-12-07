import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El precio debe ser numérico' },
  )
  @IsPositive()
  @Type(() => Number)
  precio: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  disponibilidad?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagen?: string | null;
  
  @IsInt()
  @IsNotEmpty({ message: 'La subcategoría es requerida' })
  @Type(() => Number)
  subcategoriaId: number; // ← Cambio aquí
}