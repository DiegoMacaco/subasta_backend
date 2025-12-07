# Sistema de Subastas (Backend)

API REST para la gestión integral de subastas en línea, automatizando procesos de pujas, productos y usuarios con arquitectura modular.

## Tabla de Contenidos

* **Tecnologías**
* **Requisitos Previos**
* **Instalación**
* **Configuración**
* **Ejecución**
* **Estructura del Proyecto**
* **API Endpoints**

## 🛠 Tecnologías

* **Node.js** con **NestJS** - Framework backend progresivo
* **TypeScript** - Tipado estático
* **MySQL** - Base de datos relacional
* **TypeORM** - ORM para manejo de base de datos
* **JWT** - Autenticación y autorización
* **Bcrypt** - Encriptación de contraseñas
* **Class Validator** - Validación de datos
* **Class Transformer** - Transformación de objetos
* **Multer** - Manejo de archivos
* **Dotenv** - Variables de entorno
* **CORS** - Configuración de seguridad

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* **Node.js** (v16 o superior)
* **MySQL** (v8.0 o superior)
* **Git**
* **pnpm** (se instalará en el proceso)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoMacaco/subasta_backend.git
```

### 2. Navegar al directorio del proyecto

```bash
cd subasta_backend
```

### 3. Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

### 4. Instalar dependencias

Instala todas las dependencias necesarias ejecutando los siguientes comandos:

```bash
pnpm install
pnpm add class-validator class-transformer bcrypt @nestjs/mapped-types
pnpm add -D @types/bcrypt
pnpm install multer
```

## Configuración

### 1. Crear la base de datos

Abre tu cliente MySQL y ejecuta:

```sql
CREATE DATABASE subastasDB;
USE subastasDB;
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=subastasDB
DB_SYNC=true
DB_LOGGING=true

# JWT
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRATION=7d

# Puerto del servidor
PORT=3000
```

## Ejecución

### Iniciar el servidor en modo desarrollo con seeds

```bash
pnpm run start
```

### Iniciar en modo desarrollo con hot-reload

```bash
pnpm run start:dev
```

### Iniciar en modo producción

```bash
pnpm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

```
subasta_backend/
└── src/
    ├── comun/                      # Entidades compartidas
    │   └── entities/
    │       └── auditoria.entity.ts # Auditoría de registros
    │
    ├── database/                   # Configuración y seeds
    │   ├── controladorSeeds.ts     # Controlador principal de seeds
    │   ├── seedProductos/          # Seeds de productos
    │   │   ├── seedCategorias.ts
    │   │   ├── seedProductos.ts
    │   │   └── seedSubCategoria.ts
    │   └── seedUsuarios/           # Seeds de usuarios
    │       ├── seedRol.ts
    │       ├── seedRolUsuario.ts
    │       └── seedUsuario.ts
    │
    ├── pedidos/                    # Módulo de pedidos
    │   ├── dto/                    # Data Transfer Objects
    │   │   ├── actualizarPedido.dto.ts
    │   │   ├── createPedido.dto.ts
    │   │   └── filtrarPedido.dto.ts
    │   ├── pedidosControllers/
    │   │   └── pedidos.controller.ts
    │   ├── pedidosEntities/
    │   │   ├── detallePedido.entity.ts
    │   │   └── pedidos.entity.ts
    │   ├── pedidosRepositories/
    │   │   └── pedido.repository.ts
    │   ├── pedidosServices/
    │   │   └── pedidos.service.ts
    │   └── pedidos.module.ts
    │
    ├── productos/                  # Módulo de productos y pujas
    │   ├── dto/                    # DTOs de productos y pujas
    │   │   ├── actualizarCategoria.dto.ts
    │   │   ├── actualizarProducto.dto.ts
    │   │   ├── actualizarSubCategoria.dto.ts
    │   │   ├── crearCategoria.dto.ts
    │   │   ├── crearProducto.dto.ts
    │   │   ├── crearpuja.ts
    │   │   ├── crearSubCategoria.dto.ts
    │   │   └── iniciarpuja.ts
    │   ├── productoControllers/
    │   │   ├── categoriaProductos.controller.ts
    │   │   ├── productos.controller.ts
    │   │   ├── puja.ts
    │   │   └── subcategoriaProductos.controller.ts
    │   ├── productoRepositories/
    │   │   ├── categoriaProducto.repository.ts
    │   │   ├── producto.repository.ts
    │   │   ├── puja.ts
    │   │   └── subcategoriasProductos.repository.ts
    │   ├── productosEntities/
    │   │   ├── categoriaProducto.entity.ts
    │   │   ├── producto.entity.ts
    │   │   ├── puja.entity.ts
    │   │   └── subcategoriaProductos.entity.ts
    │   ├── productoService/
    │   │   ├── categoriaProducto.service.ts
    │   │   ├── productos.service.ts
    │   │   ├── puja.ts
    │   │   └── subcategoriaProductos.service.ts
    │   ├── productos.module.ts
    │   └── puja.ts
    │
    ├── usuarios/                   # Módulo de usuarios
    │   ├── dto/
    │   │   ├── actualizar-usuario.dto.ts
    │   │   ├── crear-usuario.dto.ts
    │   │   └── login-usuario.dto.ts
    │   ├── usuarioEntities/
    │   │   ├── rol.entity.ts
    │   │   ├── rolUsuario.entity.ts
    │   │   └── usuario.entity.ts
    │   ├── service.ts
    │   ├── usuarios.controller.ts
    │   ├── usuarios.module.ts
    │   └── usuarios.service.ts
    │
    ├── app.controller.spec.ts      # Tests del controlador principal
    ├── app.controller.ts           # Controlador principal
    ├── app.module.ts               # Módulo raíz
    ├── app.service.ts              # Servicio principal
    └── main.ts                     # Punto de entrada
```

## API Endpoints

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Usuarios
- `GET /usuarios` - Obtener todos los usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Productos
- `GET /productos` - Listar productos
- `GET /productos/:id` - Obtener producto por ID
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Categorías
- `GET /categorias` - Listar categorías
- `POST /categorias` - Crear categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

### Pujas
- `POST /pujas/iniciar` - Iniciar subasta
- `POST /pujas/pujar` - Realizar puja
- `GET /pujas/:id` - Obtener pujas de un producto

### Pedidos
- `GET /pedidos` - Listar pedidos
- `GET /pedidos/:id` - Obtener pedido por ID
- `POST /pedidos` - Crear pedido
- `PUT /pedidos/:id` - Actualizar pedido

## Base de Datos

El proyecto utiliza **TypeORM** con sincronización automática. Las tablas se crearán automáticamente al iniciar el servidor si `DB_SYNC=true`.



## Autor

Diego Macaco - [GitHub](https://github.com/DiegoMacaco)
