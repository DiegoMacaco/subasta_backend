import { DataSource } from 'typeorm';
import { Usuario } from '../../usuarios/usuarioEntities/usuario.entity';

export async function seedUsuarios(dataSource: DataSource) {
  const usuarioRepo = dataSource.getRepository(Usuario);

  const usuarioExistente = await usuarioRepo.findOneBy({
    correo: 'admin@example.com',
  });

  if (usuarioExistente) {
    console.log('Usuario ya existe, saltando seed.');
    return;
  }

  const usuario = usuarioRepo.create({
    nombre: 'Diego',
    apellidoPaterno: 'Guisbert',
    apellidoMaterno: 'Huaycho',
    correo: 'diegogh1213@gmail.com',
    contrasena: 'diego1213',
    ci: '12960460',
    telefono: '61110788',
    nombreUsuario: 'diegogh', 
    verificado: true,
  });

  await usuarioRepo.save(usuario);

  console.log('Usuario seed creado exitosamente!');
}