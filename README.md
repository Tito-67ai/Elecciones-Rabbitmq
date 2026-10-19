# Elecciones - Microservicios (Spring Cloud)

| Modulo | Nombre en Eureka | Puerto | Ruta por el Gateway |
|---|---|---|---|
| ms-registry | eurekaserver | 8761 | - |
| ms-config-server | configserver | 8888 | - |
| ms-gateway | ms-gateway | 8081 | (punto de entrada) |
| ms-securityservice | ms-securityservice | 8080 | /auth/** |
| ms-patron | ms-patron | 8082 | /ciudadanos/** |
| ms-votacion | ms-votacion | 8083 | /elecciones/**, /candidatos/**, /votos/** |

Orden de arranque: registry -> config-server -> securityservice, patron, votacion -> gateway.

Cada microservicio de dominio tiene las capas: controller / service / repository / model / dto,
mas config (filtros de correlacion y del secreto del gateway) y exception.

Persistencia: H2 en memoria (`ddl-auto: update`), un esquema por servicio.
Mensajeria: RabbitMQ (el voto emitido viaja de ms-votacion a ms-patron).

Variables de entorno (ver `.env.example`):
- `JWT_SECRET` y `JWT_EXPIRATION`: firma/validez del token, en **ms-securityservice** y **ms-gateway**.
- `GATEWAY_INTERNAL_SECRET`: header interno `X-Gateway-Secret` que el Gateway propaga a los modulos.
- `RABBITMQ_*`: conexion a RabbitMQ.
- `CONFIG_SERVER_URI` / `CONFIG_SERVER_BRANCH`: repo de configuracion que clona el Config Server.

El repo de configuracion (`elecciones-properties`) lo lee el Config Server; la URI esta en
`ms-config-server/src/main/resources/application.yaml`.

Usuarios de prueba (ms-securityservice, password `1234`): `root`, `admin`, `autoridad`, `fiscal`, `elector`.

Para levantar todo con Docker: `docker compose up --build` (usa `.env`).

El compose crea la red `elecciones-network` (nombre fijo). El frontend (rama `frontend`)
trae su propio `docker-compose.yml` que se une a esa red como red externa y proxea `/api`
hacia el Gateway, asi que se levanta despues del backend.

## Llevar el proyecto a otra PC (Docker)

Requisitos: **Docker Desktop** corriendo, **Git** e internet. La primera corrida baja las
imagenes base, las dependencias Maven del build y el repo de configuracion que clona el
Config Server, por eso conviene tener buena conexion.

No hay imagenes publicadas en ningun registry: cada PC construye las suyas con `--build`.

**1) Clonar las dos ramas.** El backend y el frontend estan en ramas distintas, asi que van
en dos carpetas:

```bash
git clone -b backend  https://github.com/Tito-67ai/Elecciones-Rabbitmq.git elecciones-backend
git clone -b frontend https://github.com/Tito-67ai/Elecciones-Rabbitmq.git elecciones-frontend
```

Si se prefiere una sola carpeta, en lugar del segundo clone: `cd elecciones-backend` y
`git worktree add frontend frontend`.

**2) Crear el `.env`.** No viaja en el repo (esta gitignoreado), se copia del ejemplo:

```bash
cd elecciones-backend
cp .env.example .env
```

En Windows: `copy .env.example .env` (CMD) o `Copy-Item .env.example .env` (PowerShell).

**3) Levantar el backend.** Crea la red `elecciones-network`; la primera vez construye las 6
imagenes y tarda bastante.

```bash
docker compose up -d --build
docker compose ps
```

**4) Levantar el frontend.** Va despues, porque se conecta a la red del backend:

```bash
cd ../elecciones-frontend
docker compose up -d --build
```

**5) Entrar:** `http://localhost:4200`, usuario `admin`, password `1234`. Si el 4200 esta
ocupado, `FRONTEND_PORT=4300 docker compose up -d --build` (en Windows PowerShell:
`$env:FRONTEND_PORT='4300'; docker compose up -d --build`).

Para apagar todo: `docker compose down` en cada carpeta.

Puertos que tienen que estar libres: 4200, 8080, 8081, 8082, 8083, 8888, 8761, 5672 y 15672.

Opcional (para no compilar en la otra PC): se pueden copiar las imagenes ya construidas, una
vez por carpeta.

```bash
# en la PC de origen, dentro de cada carpeta (backend y frontend)
docker compose build
docker save $(docker compose config --images) -o imagenes.tar

# en la PC nueva, en la misma carpeta
docker load -i imagenes.tar
docker compose up -d
```
