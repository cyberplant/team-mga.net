# AGENTS.md

Guía para IAs que trabajan en este repositorio.

## Qué es este repo

Sitio web del equipo |MGA| de Call of Duty 4. Actualmente es un placeholder, pero está pensado para evolucionar a medida que el equipo vaya sumando ideas y contenido.

**URL producción:** https://team-mga.net/
**Hosting:** Dreamhost (`team_mga@roji.net:~/team-mga.net/`)

## Deploy

### Automático (GitHub Actions)

- **Push a `main`** → deploy a producción → https://team-mga.net/
- **Push a cualquier otra branch** → deploy de preview → https://team-mga.net/branch/{branch}/
- **PR cerrado/mergeado** → se borra el directorio de preview correspondiente

Secrets de GitHub Actions: `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`

### Manual (backup)

```bash
./upload.sh
```

Sube a producción via rsync. Requiere acceso SSH al servidor.

## Flujo de trabajo con Git

1. Crear branch desde `main` (`git checkout -b mi-cambio`)
2. Hacer cambios y commitear
3. Push del branch → se genera preview automática en `https://team-mga.net/branch/{branch}/`
4. Abrir Pull Request en GitHub
5. Al mergear a `main` → deploy automático a producción + limpieza del preview

**No se pushea directamente a `main`.** Todo cambio va por PR.

## Convenciones

- **Idioma del sitio**: español (Argentina)
- **Estética**: fondo negro, acentos naranja (`#ff6600`), estilo gaming/military
- **Mensajes de commit**: descriptivos, ej: `Agregar sección de miembros` (no `cambios`)
- **No usar emojis** en el código salvo que se pida
- **No crear archivos de documentación** salvo que se pida explícitamente
- **Tecnología**: libre. El equipo puede elegir frameworks, librerías o lo que prefiera. Si se agrega un build step o dependencias, documentarlo en este archivo
- Si se introducen dependencias, preferir versiones publicadas hace al menos 7 días (evitar supply chain attacks de paquetes recién publicados)

## Notas para IAs

- Los colaboradores de este repo pueden no tener experiencia con Git. Si alguien pide ayuda, guiarlo paso a paso y referirlo a `CONTRIBUTING.md`
- Antes de hacer cambios, revisar el estado actual del repo (`git status`, `git log`) para entender qué hay
- El archivo `CONTRIBUTING.md` está pensado para humanos sin experiencia — mantenerlo simple y en español
