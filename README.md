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
