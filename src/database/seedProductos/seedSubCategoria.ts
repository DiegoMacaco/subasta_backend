import { DataSource } from 'typeorm';
import { CategoriaProducto } from '../../productos/productosEntities/categoriaProducto.entity';
import { SubcategoriaProducto } from '../../productos/productosEntities/subcategoriaProductos.entity';

export async function subcategoriaSeed(dataSource: DataSource) {
  const categoriaRepo = dataSource.getRepository(CategoriaProducto);
  const subcategoriaRepo = dataSource.getRepository(SubcategoriaProducto);

  const subastas = await categoriaRepo.findOne({ where: { nombre: 'subastas' } });

  if (!subastas) {
    console.log('❌ Las categorías principales no están creadas.');
    return;
  }

  // ✅ NOMBRES CORREGIDOS para coincidir con productoSeed
  const subcategorias = [
    { nombre: 'electronicos', descripcion: 'Productos electrónicos', categoria: subastas },
    { nombre: 'vehiculos', descripcion: 'Vehículos y transportes', categoria: subastas },
    { nombre: 'cocina', descripcion: 'Artículos de cocina', categoria: subastas },
  ];

  for (const sub of subcategorias) {
    const existe = await subcategoriaRepo.findOne({
      where: { nombre: sub.nombre },
    });

    if (!existe) {
      await subcategoriaRepo.save(
        subcategoriaRepo.create({
          nombre: sub.nombre,
          descripcion: sub.descripcion,
          categoria: sub.categoria,
          activo: true,
        }),
      );
      console.log(`✔ Subcategoría "${sub.nombre}" creada`);
    }
  }

  console.log('✔ Subcategorías creadas correctamente');
  const lista = await subcategoriaRepo.find({ relations: ['categoria'] });
  console.log('📋 Lista final de subcategorías:', lista.map(s => s.nombre));
}