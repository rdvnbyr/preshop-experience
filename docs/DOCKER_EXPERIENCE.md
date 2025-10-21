# Docker Experience Guide - ExpNext Monorepo

## Überblick

Dieses Dokument enthält alle Docker-Befehle und -Konzepte, die wir in diesem Monorepo-Projekt verwendet haben. Es dient als Lernressource und Referenz für die Docker-Verwaltung.

## Grundlegende Docker-Konzepte

### Images vs. Container

- **Image**: Ein unveränderliches Template für Container (wie ein Bauplan)
- **Container**: Eine laufende Instanz eines Images (wie ein gebautes Haus)

## Docker Compose Befehle

### Projekt starten

```bash
# Alle Services im Hintergrund starten
docker-compose -f docker-compose.dev.yml up -d

# Einzelnen Service starten
docker-compose -f docker-compose.dev.yml up -d mongodb-dev
docker-compose -f docker-compose.dev.yml up -d api-dev
docker-compose -f docker-compose.dev.yml up -d client-dev
```

**Erklärung:**

- `-f`: Spezifiziert die Compose-Datei
- `up`: Startet Services
- `-d`: Detached mode (läuft im Hintergrund)

### Services anzeigen

```bash
# Status aller Services anzeigen
docker-compose -f docker-compose.dev.yml ps

# Detaillierte Informationen
docker-compose -f docker-compose.dev.yml ps -a
```

### Services stoppen

```bash
# Alle Services stoppen
docker-compose -f docker-compose.dev.yml down

# Einzelnen Service stoppen
docker-compose -f docker-compose.dev.yml stop client-dev

# Service stoppen und entfernen
docker-compose -f docker-compose.dev.yml down client-dev
```

### Services neu starten

```bash
# Service neu starten
docker-compose -f docker-compose.dev.yml restart api-dev

# Service stoppen und neu starten
docker-compose -f docker-compose.dev.yml stop api-dev
docker-compose -f docker-compose.dev.yml start api-dev
```

## Docker Build Befehle

### Images erstellen

```bash
# Alle Services neu bauen
docker-compose -f docker-compose.dev.yml build

# Einzelnen Service bauen
docker-compose -f docker-compose.dev.yml build api-dev

# Ohne Cache bauen (kompletter Neubau)
docker-compose -f docker-compose.dev.yml build --no-cache client-dev
```

**Wann verwenden:**

- `build`: Wenn sich Code geändert hat
- `--no-cache`: Bei Dependency-Problemen oder kompletten Neubau

## Container-Verwaltung

### Container-Logs anzeigen

```bash
# Logs eines Containers anzeigen
docker logs places-app-api-dev

# Live-Logs verfolgen
docker logs -f places-app-client-dev

# Nur die letzten N Zeilen
docker logs --tail 50 places-app-api-dev

# Logs mit Zeitstempel
docker logs -t places-app-mongodb-dev
```

**Praxis-Tipp:** Live-Logs (`-f`) sind sehr nützlich für Debugging!

### In Container einsteigen

```bash
# Shell im Container öffnen
docker exec -it places-app-client-dev sh

# Bash verwenden (falls verfügbar)
docker exec -it places-app-api-dev bash

# Einzelnen Befehl ausführen
docker exec places-app-client-dev npm --version
```

**Erklärung:**

- `exec`: Führt Befehl in laufendem Container aus
- `-it`: Interaktiver Terminal
- `sh/bash`: Shell-Typ

### Container-Informationen

```bash
# Container-Details anzeigen
docker inspect places-app-api-dev

# Container-Prozesse anzeigen
docker top places-app-client-dev

# Container-Ressourcenverbrauch
docker stats places-app-api-dev
```

## System-Verwaltung

### Docker-System aufräumen

```bash
# Unbenutzte Container, Netzwerke, Images entfernen
docker system prune

# Alles entfernen (inkl. Volumes)
docker system prune -a --volumes -f

# Nur unbenutzte Images entfernen
docker image prune

# Nur gestoppte Container entfernen
docker container prune
```

**Warnung:** `-a --volumes` löscht ALLES! Vorsichtig verwenden.

### Speicherplatz analysieren

```bash
# Docker-Speicherverbrauch anzeigen
docker system df

# Detaillierte Aufschlüsselung
docker system df -v
```

## Environment-spezifische Befehle

### Development Environment

```bash
# Komplettes Dev-Setup starten
docker-compose -f docker-compose.dev.yml up -d

# Einzelne Services für Debugging
docker-compose -f docker-compose.dev.yml up mongodb-dev
docker-compose -f docker-compose.dev.yml up api-dev
docker-compose -f docker-compose.dev.yml up client-dev
```

### Container-Environment-Variablen prüfen

```bash
# Alle Environment-Variablen anzeigen
docker exec places-app-api-dev printenv

# Spezifische Variable prüfen
docker exec places-app-api-dev echo $MONGO_URI
docker exec places-app-api-dev env | grep MONGO
```

## Debugging-Strategien

### Problem: Container startet nicht

```bash
# 1. Logs prüfen
docker logs places-app-api-dev

# 2. Container-Status prüfen
docker-compose -f docker-compose.dev.yml ps

# 3. Image neu bauen
docker-compose -f docker-compose.dev.yml build --no-cache api-dev

# 4. Container neu starten
docker-compose -f docker-compose.dev.yml up -d api-dev
```

### Problem: Dependency-Fehler

```bash
# 1. In Container einsteigen
docker exec -it places-app-client-dev sh

# 2. Dependencies neu installieren
cd /workspace/client
rm -rf node_modules package-lock.json
npm install

# 3. Container neu starten
exit
docker restart places-app-client-dev
```

### Problem: Port-Konflikte

```bash
# Ports prüfen, die verwendet werden
docker-compose -f docker-compose.dev.yml ps
netstat -tulpn | grep :3000
lsof -i :4000
```

## Häufige Probleme und Lösungen

### 1. ARM64/x86 Kompatibilitätsprobleme

```bash
# Problem: Native Dependencies funktionieren nicht
# Lösung: Platform spezifizieren
# In docker-compose.yml:
# platform: linux/amd64
```

### 2. Tailwind CSS Binary-Probleme

```bash
# Problem: @tailwindcss/oxide Binary fehlt
# Lösung 1: Node.js Version ändern (20 → 22)
# Lösung 2: Tailwind CSS downgraden (v4 → v3.4.1)
```

### 3. MongoDB Connection-Probleme

```bash
# Problem: MONGO_URI vs MONGODB_URI
# Lösung: Environment-Variablen Namen vereinheitlichen

# Prüfen welche Variablen verfügbar sind:
docker exec places-app-api-dev printenv | grep MONGO
```

### 4. Logger Package Import-Probleme

```bash
# Problem: Cannot find module '@exp-places-app/logger'
# Lösung: Logger package in Container-Build-Prozess einbinden

# Logger neu bauen:
npm run build:logger

# Container neu bauen:
docker-compose -f docker-compose.dev.yml build --no-cache api-dev
```

## Performance-Optimierung

### Multi-Stage Builds verwenden

```dockerfile
# Beispiel aus unserem API Dockerfile:
FROM node:20-alpine
COPY . /workspace
WORKDIR /workspace/packages/logger
RUN npm install && npm run build
WORKDIR /app
RUN cp -r /workspace/api/* .
RUN npm install
```

### Volumes für Entwicklung

```yaml
# In docker-compose.dev.yml:
volumes:
  - api_dev_logs:/app/logs # Logs persistent halten
  - mongodb_dev_data:/data/db # Datenbank persistent halten
```

## Monitoring und Health Checks

### Health Checks implementieren

```bash
# API Health Check testen
curl http://localhost:4000/api/health

# Container Health Status prüfen
docker inspect places-app-api-dev | grep Health -A 10
```

### Resource Monitoring

```bash
# Real-time Resource Usage
docker stats

# Spezifischer Container
docker stats places-app-api-dev --no-stream

# Memory Usage Details
docker exec places-app-api-dev cat /proc/meminfo
```

## Best Practices aus diesem Projekt

### 1. Development vs Production

- Separate Dockerfiles: `Dockerfile.dev` vs `Dockerfile`
- Separate Compose-Dateien: `docker-compose.dev.yml` vs `docker-compose.yml`

### 2. Monorepo-Struktur

- Logger Package zuerst bauen
- Packages als Dependencies in Container kopieren
- Workspace-Structure respektieren

### 3. Debugging-freundlich

- Live-Logs verwenden: `docker logs -f`
- Interactive Shells: `docker exec -it`
- Environment-Variablen prüfbar machen

### 4. Saubere Entwicklung

- Regelmäßig `docker system prune`
- `--no-cache` bei Problemen verwenden
- Ein Service nach dem anderen debuggen

## Cheat Sheet - Wichtigste Befehle

```bash
# Projekt starten
docker-compose -f docker-compose.dev.yml up -d

# Logs verfolgen
docker logs -f places-app-api-dev

# In Container einsteigen
docker exec -it places-app-client-dev sh

# Services neu bauen
docker-compose -f docker-compose.dev.yml build --no-cache

# Alles stoppen und aufräumen
docker-compose -f docker-compose.dev.yml down
docker system prune -f

# Status prüfen
docker-compose -f docker-compose.dev.yml ps
```

## Fazit

Docker bietet mächtige Tools für Entwicklung und Deployment. Die wichtigsten Erkenntnisse:

1. **Logs sind dein Freund** - Immer zuerst `docker logs` prüfen
2. **Incremental Debugging** - Ein Service nach dem anderen
3. **Clean Builds** - Bei Problemen `--no-cache` verwenden
4. **Environment Variables** - Naming-Konsistenz ist wichtig
5. **Platform Compatibility** - ARM64 vs x86 beachten

Mit diesen Befehlen und Strategien sollte die Docker-Verwaltung deutlich einfacher werden!
