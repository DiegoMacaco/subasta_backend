import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe ser válido' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  contrasena: string;
}