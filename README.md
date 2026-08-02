# Kaleidosync Docker

[![Docker Pulls](https://img.shields.io/docker/pulls/brgjr10/kaleidosync?logo=docker&style=flat)](https://hub.docker.com/repository/docker/brgjr10/kaleidosync)
[![Docker Image](https://img.shields.io/docker/v/brgjr10/kaleidosync/latest?logo=docker&style=flat)](https://hub.docker.com/repository/docker/brgjr10/kaleidosync/general)
[![Docker Stars](https://img.shields.io/docker/stars/brgjr10/kaleidosync?logo=docker&style=flat)](https://hub.docker.com/repository/docker/brgjr10/kaleidosync)
[![GitHub release](https://img.shields.io/github/v/release/brgjr10/kaleidosync-docker?logo=github&style=flat)](https://github.com/brgjr10/kaleidosync-docker/releases)
[![GitHub Packages](https://img.shields.io/badge/ghcr.io-kaleidosync-blue?logo=github&style=flat)](https://github.com/brgjr10/kaleidosync-docker/packages)
[![Build Status](https://img.shields.io/github/actions/workflow/status/brgjr10/kaleidosync-docker/docker-publish.yml?branch=master&style=flat)](https://github.com/brgjr10/kaleidosync-docker/actions/workflows/docker-publish.yml)

Fork of [zachwinter/kaleidosync](https://github.com/zachwinter/kaleidosync), containerized for Docker with Spotify OAuth fixes and audio-analysis-backed now-playing.

WebGL music visualizer running in Docker. Frontend is served by nginx on port `8080`, Spotify auth is handled by a separate Express API container on port `2223`.

## Quick start

### Using pre-built images

Images are published on both [Docker Hub](https://hub.docker.com/repository/docker/brgjr10/kaleidosync/general) and [GitHub Packages](https://github.com/brgjr10/kaleidosync-docker/packages).

**Docker Hub:**
```bash
docker run -d \
  --name kaleidosync-web \
  -p 8080:80 -p 443:443 \
  -e API_BACKEND=http://kaleidosync-api:2223 \
  -e SOCKET_BACKEND=http://kaleidosync-api:2223 \
  --restart unless-stopped \
  brgjr10/kaleidosync:latest
```

**GitHub Packages (GHCR):**
```bash
docker run -d \
  --name kaleidosync-web \
  -p 8080:80 -p 443:443 \
  -e API_BACKEND=http://kaleidosync-api:2223 \
  -e SOCKET_BACKEND=http://kaleidosync-api:2223 \
  --restart unless-stopped \
  ghcr.io/brgjr10/kaleidosync:latest
```

Available tags follow semver (e.g. `10.0`, `10.0.15`) plus `latest`. See the badges above for the latest version.

### Building from source

```bash
git clone https://github.com/brgjr10/kaleidosync-docker.git
cd kaleidosync-docker

# Create .env (see Environment variables below)
cp .env.example .env  # edit with your Spotify credentials

docker compose up -d
```

Open `http://<host-ip>:8080`.

## Spotify authentication

Spotify only allows `127.0.0.1` loopback redirect URIs for local apps. Because this runs inside Docker, the callback hits `127.0.0.1:2223` on the **host machine**, not your local machine.

**If you are accessing the app from another device** (e.g. Windows browser), you must create an SSH tunnel so the callback can reach the host:

```powershell
ssh -N -L 8080:localhost:8080 -L 2223:localhost:2223 {root/user_id}@{client_ip}
```

Leave that session open while authenticating. Then open `http://localhost:8080` in your browser and go through the Spotify auth flow.

## Auth redirect URI

In the Spotify Developer Dashboard, set the redirect URI to:

```
http://127.0.0.1:2223/api/spotify/callback
```

## Environment variables

Create a `.env` file in the project root before starting:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

`.env` is gitignored. `docker-compose.yml` loads it via `env_file`.

## Development mode

```bash
docker compose --profile dev up
```

This starts a `node:20-alpine` container with Vite dev server mapped to:
- `5175` -> Vue frontend
- `5176` -> API/Socket proxy

## Architecture

| Container | Port | Purpose |
|-----------|------|---------|
| `web` | `8080`, `443` | nginx serving built frontend |
| `api` | `2223` | Express Spotify auth + now-playing API |
| `dev` | `5175`, `5176` | Vite dev server (profile must be enabled) |

## Production notes

- The `web` container proxies `/api/*` and `/socket.io/*` to the `api` container.
- HTTPS is served on `443`.
- Spotify auth requires the SSH tunnel from non-host devices.
