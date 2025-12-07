import { DataSource } from 'typeorm';
import { Producto } from '../../productos/productosEntities/producto.entity';
import { SubcategoriaProducto } from '../../productos/productosEntities/subcategoriaProductos.entity';

export async function productoSeed(dataSource: DataSource) {
  const productoRepo = dataSource.getRepository(Producto);
  const subcategoriaRepo = dataSource.getRepository(SubcategoriaProducto);
  const electronicos = await subcategoriaRepo.findOne({ where: { nombre: 'electronicos' } });
  const vehiculos = await subcategoriaRepo.findOne({ where: { nombre: 'vehiculos' } });
  const cocina = await subcategoriaRepo.findOne({where:{ nombre: 'cocina'}})

  if (!electronicos || !vehiculos || !cocina) {
  console.log('Las subcategorías necesarias no están creadas.');
  return;
}

  const productos = [
    {
      nombre: 'Microndas',
      descripcion: 'Horno microondas de alta potencia y eficiencia energética',
      precio: 10,
      disponibilidad: 1,
      subcategoria: electronicos,
      activo: true,
      imagen: '/uploads/productos/microndas.jpg',
    },
  ];

  for (const prod of productos) {
    const existe = await productoRepo.findOne({
      where: { nombre: prod.nombre },
    });

    if (!existe) {
      await productoRepo.save(productoRepo.create(prod));
    }
  }

  console.log('✔ Productos creados correctamente');
}

