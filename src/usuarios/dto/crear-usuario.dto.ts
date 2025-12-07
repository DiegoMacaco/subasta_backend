import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  @IsString()
  apellidoPaterno: string;

  @IsOptional()
  @IsString()
  apellidoMaterno?: string;

  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe ser válido' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  telefono: string;
}