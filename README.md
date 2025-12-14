# 📋 Mini-Backend - Sistema de Gestión de Tareas

> Backend completo con Node.js, TypeScript, Express y TypeORM para gestión de tareas colaborativas con equipos, estados tipo Kanban, etiquetas y comentarios.

## 🚀 Características

- ✅ Autenticación JWT con bcrypt
- 👥 Sistema de usuarios (admin/user)
- 🏢 Gestión de equipos con roles (PROPIETARIO/MIEMBRO)
- 📝 CRUD completo de tareas
- 🎯 Estados Kanban (PENDIENTE, EN_CURSO, FINALIZADA, CANCELADA)
- 🏷️ Sistema de etiquetas para clasificar tareas
- 💬 Comentarios en tareas
- 📊 Historial de cambios de estado
- 🔐 Control de permisos por rol

## 📦 Tecnologías

- **Node.js** - Runtime
- **TypeScript** - Lenguaje
- **Express** - Framework web
- **TypeORM** - ORM para base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **CORS** - Control de acceso

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ramadion/Mini-Backend.git
cd Mini-Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:

```env
# Database
DB_PATH=./db.sqlite

# JWT (⚠️ CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# TypeORM
TYPEORM_LOGGING=true
```

### 4. Ejecutar migraciones
```bash
npm run migration:run
```

### 5. Iniciar servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Generar nueva migración
npm run migration:generate

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Eliminar toda la base de datos
npm run db:drop

# Resetear base de datos (drop + run migrations)
npm run db:reset
```

## 🔑 Autenticación

### Registro de Usuario
```http
POST /users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123",
  "rol": "user"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar el Token
En todas las rutas protegidas, incluye el header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📖 Documentación API

### 👤 Usuarios

#### Crear Usuario (Público)
```http
POST /users
Content-Type: application/json

{
  "name": "María González",
  "email": "maria@ejemplo.com",
  "password": "password123",
  "rol": "user"
}
```

#### Listar Usuarios (Requiere Token)
```http
GET /users
Authorization: Bearer {token}
```

#### Actualizar Usuario (Requiere Token - Solo propio perfil)
```http
PUT /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "María González Actualizada",
  "email": "maria.nueva@ejemplo.com"
}
```

#### Cambiar Contraseña (Requiere Token)
```http
PUT /users/:id/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "nuevaPassword456"
}
```

#### Eliminar Usuario (Requiere Token - Solo propia cuenta)
```http
DELETE /users/:id
Authorization: Bearer {token}
```

### 🏢 Equipos

#### Crear Equipo
```http
POST /teams
Content-Type: application/json

{
  "name": "Equipo de Desarrollo",
  "propietarioId": 1
}
```

#### Listar Equipos
```http
GET /teams

# Filtrar por usuario
GET /teams?userid=1
```

#### Obtener Equipo
```http
GET /teams/:id
```

#### Actualizar Equipo
```http
PUT /teams/:id
Content-Type: application/json

{
  "name": "Equipo de Desarrollo Backend",
  "actorUserId": 1
}
```

#### Eliminar Equipo
```http
DELETE /teams/:id
Content-Type: application/json

{
  "actorUserId": 1
}
```

### 👥 Membresías de Equipo

#### Agregar Miembro
```http
POST /teams/:id/miembros
Content-Type: application/json

{
  "userId": 2,
  "rol": "MIEMBRO",
  "actorUserId": 1
}
```

**Roles disponibles:** `PROPIETARIO`, `MIEMBRO`

#### Listar Miembros
```http
GET /teams/:id/miembros
```

#### Cambiar Rol de Miembro
```http
PUT /teams/:id/miembros/:usuarioId
Content-Type: application/json

{
  "nuevoRol": "PROPIETARIO",
  "actorUserId": 1
}
```

#### Remover Miembro
```http
DELETE /teams/:id/miembros/:usuarioId
Content-Type: application/json

{
  "actorUserId": 1
}
```

### 📝 Tareas

#### Crear Tarea
```http
POST /tasks
Content-Type: application/json

{
  "title": "Implementar autenticación",
  "description": "Crear sistema de login con JWT",
  "teamId": 1,
  "userId": 1,
  "priority": "alta",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

**Prioridades:** `baja`, `media`, `alta`

#### Listar Tareas de Usuario
```http
GET /tasks/:userId
```

#### Actualizar Tarea
```http
PUT /tasks/:id
Content-Type: application/json

{
  "userId": 1,
  "title": "Implementar autenticación JWT",
  "description": "Crear sistema completo de autenticación",
  "priority": "alta"
}
```

#### Eliminar Tarea
```http
DELETE /tasks/:id
Content-Type: application/json

{
  "userId": 1
}
```

### 🎯 Estados Kanban

#### Cambiar Estado de Tarea
```http
PUT /tareas/:id/estado
Content-Type: application/json

{
  "estado": "EN_CURSO",
  "usuarioId": 1
}
```

**Estados disponibles:**
- `PENDIENTE`
- `EN_CURSO`
- `FINALIZADA`
- `CANCELADA`

**Transiciones válidas:**
- PENDIENTE → EN_CURSO, CANCELADA
- EN_CURSO → FINALIZADA, CANCELADA, PENDIENTE
- FINALIZADA → EN_CURSO, CANCELADA
- CANCELADA → PENDIENTE, EN_CURSO

#### Obtener Historial de Estados
```http
GET /tareas/:id/historial
```

#### Obtener Tareas por Estado
```http
GET /equipos/:equipoId/tareas/:estado

# Ejemplo:
GET /equipos/1/tareas/EN_CURSO
```

### 🏷️ Etiquetas

#### Crear Etiqueta
```http
POST /etiquetas
Content-Type: application/json

{
  "nombre": "Bug",
  "color": "#FF0000"
}
```

#### Listar Etiquetas
```http
GET /etiquetas
```

#### Obtener Etiqueta
```http
GET /etiquetas/:id
```

#### Actualizar Etiqueta
```http
PUT /etiquetas/:id
Content-Type: application/json

{
  "nombre": "Bug Crítico",
  "color": "#FF0000"
}
```

#### Eliminar Etiqueta
```http
DELETE /etiquetas/:id
```

#### Asignar Etiquetas a Tarea
```http
PUT /tareas/:id/etiquetas
Content-Type: application/json

{
  "etiquetasIds": [1, 2, 3],
  "usuarioId": 1
}
```

#### Desasignar Etiqueta de Tarea
```http
DELETE /tareas/:id/etiquetas/:etiquetaId
Content-Type: application/json

{
  "usuarioId": 1
}
```

#### Obtener Etiquetas de Tarea
```http
GET /tareas/:id/etiquetas
```

#### Obtener Tareas por Etiqueta
```http
POST /etiquetas/:etiquetaId/tareas
Content-Type: application/json

{
  "usuarioId": 1
}
```

### 💬 Comentarios

#### Crear Comentario
```http
POST /tareas/:tareaId/comentarios
Content-Type: application/json

{
  "contenido": "Este es un comentario importante",
  "usuarioId": 1
}
```

#### Obtener Comentarios de Tarea
```http
GET /tareas/:tareaId/comentarios?usuarioId=1
```

#### Actualizar Comentario
```http
PUT /comentarios/:commentId
Content-Type: application/json

{
  "contenido": "Comentario actualizado",
  "usuarioId": 1
}
```

#### Eliminar Comentario
```http
DELETE /comentarios/:commentId
Content-Type: application/json

{
  "usuarioId": 1
}
```

## 🔒 Permisos y Roles

### Roles de Usuario
- **admin**: Acceso total al sistema
- **user**: Acceso limitado a sus equipos

### Roles de Membresía
- **PROPIETARIO**: 
  - Crear/editar/eliminar tareas
  - Agregar/remover miembros
  - Cambiar roles
  - Gestionar etiquetas
  - Eliminar equipo
  
- **MIEMBRO**:
  - Ver tareas del equipo
  - Cambiar estados de tareas
  - Comentar en tareas
  - Salir del equipo

## ⚠️ Errores Comunes y Soluciones

### Error: "Token inválido o expirado"
**Solución:** Realiza login nuevamente para obtener un nuevo token.

### Error: "Solo los propietarios pueden crear tareas"
**Solución:** Verifica que el usuario tenga rol PROPIETARIO en el equipo.

### Error: "Transición no válida"
**Solución:** Revisa las transiciones válidas de estados Kanban arriba.

### Error: "El usuario no es miembro de este equipo"
**Solución:** Agrega al usuario al equipo antes de asignarle tareas.

### Error: "Ya existe una etiqueta con ese nombre"
**Solución:** Usa un nombre diferente para la etiqueta.

### Error: "No se puede modificar una tarea finalizada o cancelada"
**Solución:** Cambia primero el estado de la tarea a EN_CURSO.

## 🧪 Flujo de Prueba Completo

```bash
# 1. Crear usuarios
POST /users → Admin (id: 1)
POST /users → Dev1 (id: 2)
POST /users → Dev2 (id: 3)

# 2. Login como Admin
POST /auth/login → Obtener token

# 3. Crear equipo
POST /teams → Equipo Dev (id: 1, propietario: 1)

# 4. Agregar miembros
POST /teams/1/miembros → Agregar Dev1
POST /teams/1/miembros → Agregar Dev2

# 5. Crear etiquetas
POST /etiquetas → Bug
POST /etiquetas → Feature
POST /etiquetas → Urgente

# 6. Crear tareas
POST /tasks → Tarea 1
POST /tasks → Tarea 2

# 7. Asignar etiquetas
PUT /tareas/1/etiquetas → [1, 3]

# 8. Cambiar estados
PUT /tareas/1/estado → EN_CURSO
PUT /tareas/1/estado → FINALIZADA

# 9. Comentar
POST /tareas/1/comentarios → "Tarea completada"

# 10. Ver historial
GET /tareas/1/historial
```

## 📊 Estructura del Proyecto

```
src/
├── config/
│   └── data-source.ts          # Configuración TypeORM
├── controllers/                # Controladores de rutas
│   ├── auth.controller.ts
│   ├── comment.controller.ts
│   ├── estado.controller.ts
│   ├── etiqueta.controller.ts
│   ├── membership.controller.ts
│   ├── tarea-etiqueta.controller.ts
│   ├── task.controller.ts
│   ├── team.controller.ts
│   └── user.controller.ts
├── entities/                   # Entidades TypeORM
│   ├── comment.entity.ts
│   ├── etiqueta.entity.ts
│   ├── historial-estado.entity.ts
│   ├── membership.entity.ts
│   ├── task.entity.ts
│   ├── team.entity.ts
│   └── user.entity.ts
├── middleware/
│   └── auth.middleware.ts      # Middleware de autenticación
├── migrations/                 # Migraciones de base de datos
├── repositories/               # Repositorios de datos
│   ├── comment.repository.ts
│   ├── etiqueta.repository.ts
│   ├── membership.repository.ts
│   ├── task.repository.ts
│   ├── team.repository.ts
│   └── user.repository.ts
├── routes/                     # Definición de rutas
│   ├── auth.routes.ts
│   ├── comment.routes.ts
│   ├── estado.routes.ts
│   ├── etiqueta.routes.ts
│   ├── membership.routes.ts
│   ├── tarea-etiqueta.routes.ts
│   ├── task.routes.ts
│   ├── team.routes.ts
│   └── user.routes.ts
├── services/                   # Lógica de negocio
│   ├── auth.service.ts
│   ├── comment.service.ts
│   ├── estado.service.ts
│   ├── etiqueta.service.ts
│   ├── membership.service.ts
│   ├── tarea-etiqueta.service.ts
│   ├── task.service.ts
│   ├── team.service.ts
│   └── user.service.ts
└── index.ts                    # Punto de entrada
```

## 🐛 Correcciones Implementadas

### 1. **PowerShell a HTTP** ✅
Los comandos del README original usaban sintaxis de PowerShell. Ahora usan formato HTTP estándar.

### 2. **Autenticación JWT** ✅
Se agregó sistema completo de autenticación con tokens JWT.

### 3. **Campo dueDate** ✅
Se añadió soporte para fechas de vencimiento en tareas.

### 4. **Query Parameters en GET** ✅
Corregido el controlador de comentarios para usar `req.query` en lugar de `req.body`.

### 5. **Validaciones Mejoradas** ✅
Se agregaron validaciones más robustas en todos los servicios.

### 6. **Documentación Completa** ✅
README completamente reescrito con ejemplos claros y estructura mejorada.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👨‍💻 Autor

Ramadion - [GitHub](https://github.com/Ramadion)

## 🙏 Agradecimientos

- Node.js Community
- TypeORM Team
- Express.js Team



