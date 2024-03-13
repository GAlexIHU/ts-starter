# TS Starter Repo

The purpose of this repo is to provide a starting point for a TypeScript monorepo with a backend and frontend. The backend is a fastify server with a REST API & the frontend is a static react application.

## First Time Setup

> The development environment is abstracted away using [Nix](https://nixos.org/manual/nix/stable/command-ref/nix-shell), but it is completely optional to use. In case you want to use Nix for your local environment, first install Nix, (in case of VSCode also the recommended extensions), and then run `nix-shell` from the terminal.

Alternatively, the list of dependencies:

- Node 20
- Docker (not part of the Nix environment, needs to live on host)

The project uses `pnpm` as its package manager. PnPm is intalled using `corepack`.

> When using the Nix environment, `corepack enable` requires sudo privileges as `/nix/store` is group readonly.

## Build and Run

The two apps are dockerised, you can build and run them with the following commands:

```
pnpm i
docker compose --profile localstack up --build -d
```
