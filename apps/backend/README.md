# `@repo/backend`

`@repo/backend` is a backend service that provides a REST API for the frontend to consume.

## DB Migrations

Migrations are managed with [migrate](https://github.com/golang-migrate/migrate?tab=readme-ov-file#cli-usage). Their management is conceptually separate from the application. Some helpful commands can be found here:

```sh
# Create a new migration
docker run -v $(pwd)/apps/backend/migrations:/migrations --network host migrate/migrate -database postgres://user:password@localhost:5432/db create -dir /migrations -ext sql initial

# Run migrations
docker run -v $(pwd)/apps/backend/migrations:/migrations --network host migrate/migrate -path=/migrations/ -database postgres://user:password@localhost:5432/db?sslmode=disable up

# Force fix a migration
docker run -v $(pwd)/apps/backend/migrations:/migrations --network host migrate/migrate -path=/migrations/ -database postgres://user:password@localhost:5432/db?sslmode=disable force 20210919123456
```
