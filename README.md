# Back TCS - API REST

API REST desarrollada con NestJS para la gestión de productos, usuarios y cotizaciones.

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL (v15 o superior)
- Docker y Docker Compose (opcional, para desarrollo local)

## Configuración del Proyecto

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env-example`:

```bash
cp .env-example .env
```

Configura las siguientes variables de entorno en tu archivo `.env`:

#### Variables de Base de Datos (Requeridas)

```env
DB_HOST=localhost          # Host de PostgreSQL
DB_PORT=5432              # Puerto de PostgreSQL (por defecto: 5432)
DB_USERNAME=tu_usuario    # Usuario de PostgreSQL
DB_PASSWORD=tu_password   # Contraseña de PostgreSQL
DB_NAME=nombre_bd         # Nombre de la base de datos
```

#### Variables de Azure Service Bus (Opcionales)

```env
AZURE_SB_CONNECTION=      # Cadena de conexión de Azure Service Bus
AZURE_SB_QUEUE=           # Nombre de la cola de Azure Service Bus
```

#### Variables de Azure Storage (Opcionales)

```env
AZURE_STORAGE_CONTAINER=  # Nombre del contenedor de Azure Storage
AZURE_STORAGE_CONNECTION= # Cadena de conexión de Azure Storage
```

### 3. Levantar el proyecto

#### Usando Docker Compose

```bash
docker compose up -d --build
```

### 4. Ejecución de Migraciones

Una vez configurada la base de datos, ejecuta las migraciones para crear las tablas necesarias:

```bash
npm run migration:run
```

### Modo Desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

### Modo Producción

```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

### Modo Debug

```bash
npm run start:debug
```

## Documentación de la API

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

**URL de Documentación:** `http://localhost:3000/api/docs`

La documentación incluye:
- Endpoints de productos (`/products`)
- Endpoints de usuarios (`/users`)
- Endpoints de cotizaciones (`/quotes`)
- Esquemas de datos y validaciones
- Capacidad de probar los endpoints directamente desde el navegador

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia el servidor en modo desarrollo con hot-reload
npm run start:debug        # Inicia el servidor en modo debug

# Producción
npm run build              # Compila el proyecto TypeScript
npm run start:prod        # Ejecuta la aplicación compilada

# Migraciones
npm run migration:run      # Ejecuta las migraciones pendientes

# Testing
npm run test               # Ejecuta los tests unitarios

## Estructura del Proyecto

El proyecto sigue una arquitectura hexagonal (Clean Architecture) con las siguientes capas:

- **Domain**: Entidades, agregados, repositorios y puertos del dominio
- **Application**: Casos de uso y DTOs de aplicación
- **Infrastructure**: Implementaciones de infraestructura (API, persistencia, servicios externos)
