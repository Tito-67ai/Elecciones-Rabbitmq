# Elecciones - Frontend (Angular)

SPA en Angular 22 que consume la API de los microservicios a traves del **Gateway**
(`ms-gateway`, puerto `8081`). Vive en la rama `frontend`; el backend esta en la rama `backend`.

## Requisitos

- Node.js 24 (y npm 11)
- El backend levantado (`registry` -> `config-server` -> servicios de dominio -> `gateway`)

## Puesta en marcha

```bash
npm install
npm start
```

Queda en `http://localhost:4200`.

La URL de la API esta en `src/environments/environment.ts` (`http://localhost:8081` en
desarrollo). El Gateway ya tiene CORS habilitado para `http://localhost:4200`.

## Usuarios de prueba

Los siembra `ms-securityservice`, password `1234`:
`root`, `admin`, `autoridad`, `fiscal`, `elector`.

## Estructura

```
src/app/
  core/            modelos, servicios HTTP, interceptores y guards
    guards/        authGuard y roleGuard
    interceptors/  Authorization: Bearer <token> y manejo de errores
    models/        Ciudadano, Eleccion, Candidato, Voto, Usuario, Sesion
    services/      un servicio por microservicio + sesion y notificaciones
  features/        login, layout, dashboard y pantallas de dominio
  app.routes.ts    rutas lazy con proteccion por rol
  app.config.ts    router + HttpClient con interceptores
```

## Pantallas y roles

| Pantalla | Ruta | Roles habilitados |
|---|---|---|
| Inicio | `/inicio` | todos |
| Padrón | `/padron` | todos (`ELECTOR` solo consulta por DNI) |
| Elecciones | `/elecciones` | ADMIN, ROOT, AUTORIDAD_MESA, FISCAL, ELECTOR |
| Candidatos | `/candidatos` | ADMIN, ROOT, AUTORIDAD_MESA, FISCAL, ELECTOR |
| Emitir voto | `/votar` | ELECTOR, AUTORIDAD_MESA |
| Votos emitidos | `/votos` | ADMIN, ROOT, AUTORIDAD_MESA, FISCAL |
| Resultados | `/resultados` | ADMIN, ROOT, AUTORIDAD_MESA, FISCAL |
| Usuarios | `/usuarios` | ROOT, ADMIN |

Solo `ADMIN` y `ROOT` pueden dar de alta, editar y eliminar; el resto de los roles consulta.
El `roleGuard` y el `authGuard` bloquean el acceso a las rutas no permitidas.

## Tests y build

```bash
npm test -- --watch=false
npm run build
```

El CI de la rama (`frontend-ci.yml`) instala, compila y corre los tests en cada push.
