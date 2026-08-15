# Cómo colaborar con la página del |MGA|

¡Hola! Si llegaste acá es porque querés ayudar con la página del equipo. No te preocupes si nunca usaste Git — esta guía está pensada para que cualquiera pueda colaborar, incluso sin experiencia.

---

## Lo básico: qué es Git y GitHub

**Git** es un sistema que guarda el historial de cambios de un proyecto. Es como "guardar como" pero con memoria: podés volver a cualquier versión anterior.

**GitHub** es un sitio web donde subimos el proyecto para que todos podamos trabajar juntos. Nuestro repo está en:
👉 https://github.com/cyberplant/team-mga.net

**Branch** (rama): es como una copia del proyecto donde podés hacer cambios sin afectar la versión principal. Cuando terminás, pedís que se integren tus cambios.

**Pull Request** (PR): es el pedido de "por favor integren mis cambios a la página principal".

---

## Opción 1: Editar directo en GitHub (lo más fácil)

Si el cambio es chico (cambiar un texto, un link, un color):

1. Andá a https://github.com/cyberplant/team-mga.net
2. Buscá el archivo que querés editar
3. Hacé clic en el lápiz ✏️ arriba a la derecha del archivo
4. Hacé tus cambios
5. Abajo donde dice "Commit changes", cambiá el nombre de la branch a algo descriptivo, por ejemplo `cambiar-texto-slogan`
6. Clic en "Propose changes"
7. Se abre un Pull Request — escribí una descripción y clic en "Create pull request"
8. Esperá a que alguien revise y apruebe

Cuando se apruebe, **se sube solo** a la página. No tenés que hacer nada más.

---

## Opción 2: Trabajar en tu computadora (para cambios más grandes)

### Instalación (una sola vez)

1. **Instalá Git**: descargalo de https://git-scm.com/downloads
   - En Windows, te va a instalar **Git Bash** (una terminal que funciona como la de Linux). Usá esa para los comandos de Git.
2. **Configurá tu nombre y email** (abrir Git Bash en Windows, o Terminal en Mac/Linux):
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@email.com"
   ```
3. **Cloná el repo** (bajar una copia a tu PC):
   ```bash
   git clone git@github.com:cyberplant/team-mga.net.git
   cd team-mga.net
   ```

### ¿No te gusta la consola? Usá GitHub Desktop

Si estás en Windows y no querés usar la consola, **GitHub Desktop** es una app con interfaz gráfica que hace lo mismo pero con botones:

1. Descargalo de https://desktop.github.com/
2. Iniciá sesión con tu cuenta de GitHub
3. Clic en "Clone a repository from the Internet" → buscá `cyberplant/team-mga.net`
4. Para crear una branch: arriba dice "Current branch" → hacé clic → "New branch"
5. Para guardar cambios: escribí un mensaje abajo a la izquierda y clic en "Commit to..."
6. Para subir: clic en "Push origin"
7. Para abrir un PR: clic en "View on GitHub" → "Create pull request"

Es lo mismo que la consola, pero con botones. Usá lo que te sea más cómodo.

### Flujo de trabajo (cada vez que quieras cambiar algo)

1. **Actualizá tu copia** (para tener los últimos cambios):
   ```bash
   git checkout main
   git pull
   ```

2. **Creá una branch** para tu cambio:
   ```bash
   git checkout -b mi-cambio
   ```
   (usá un nombre descriptivo, ej: `agregar-lista-miembros`)

3. **Hacé los cambios** en los archivos que quieras (con tu editor favorito)

4. **Guardá tus cambios en Git**:
   ```bash
   git add -A
   git commit -m "Descripción de lo que cambiaste"
   ```

5. **Subí tu branch**:
   ```bash
   git push origin mi-cambio
   ```

6. **Abrí un Pull Request**:
   - Andá a https://github.com/cyberplant/team-mga.net
   - Te va a aparecer un botón verde "Compare & pull request" — hacé clic
   - Escribí una descripción y clic en "Create pull request"

7. **Esperá la revisión**. Cuando se apruebe y se mergee, se sube solo a producción.

---

## Previews automáticas

Cuando subís una branch, **automáticamente se genera una página de preview**:

- Si tu branch se llama `agregar-lista-miembros`, la preview está en:
  `https://team-mga.net/branch/agregar-lista-miembros/`

Esto es genial porque podés ver cómo quedaría tu cambio antes de que llegue a producción. Compartí ese link con el equipo para que revisen.

Cuando el PR se mergea o se cierra, la preview **se borra sola**.

---

## Reglas importantes

- **No subas cambios directamente a `main`**. Siempre trabajá en una branch y abrí un Pull Request.
- **Mensajes de commit descriptivos**: `Agregar sección de miembros` ✅ — `cambios` ❌
- **Antes de empezar algo grande**, avisá en el grupo para no pisar el trabajo de otro.
- **Tecnología**: podés usar lo que quieras (frameworks, librerías, lo que prefieras). Si agregás algo que requiere instalación o build, dejá una nota en el PR explicando qué hay que instalar.

---

## Pedir ayuda a una IA

Si estás usando Devin, Claude, o cualquier otra IA para que te ayude, decile:

> "Estoy trabajando en el repo team-mga.net, lee el AGENTS.md para entender el proyecto"

El archivo `AGENTS.md` tiene toda la info técnica que la IA necesita para ayudarte bien.

**¿La IA puede hacer el Git por mí?**
Sí. Si estás usando una IA que puede ejecutar comandos (como Devin), podés pedirle directamente que cree la branch, haga el commit, suba el código y abra el PR. Vos solo concentráte en qué querés cambiar y dejá que la IA se ocupe del resto.

---

## Preguntas frecuentes

**¿Necesito instalar algo?**
Solo Git (https://git-scm.com/downloads). Dependiendo de qué tecnología use el proyecto en cada momento, puede haber dependencias extra — revisá el PR o preguntá en el grupo.

**¿Cómo veo la página después de cambiar algo?**
Subí tu branch y mirá la preview en `https://team-mga.net/branch/{nombre-de-tu-branch}/`. Si querés verlo localmente, preguntá en el grupo o a una IA cómo levantar un servidor para la tecnología que esté usando el proyecto en ese momento.

**¿Puedo romper algo?**
¡Tranquilo! Siempre trabajamos en branches. La página principal (`main`) solo se actualiza cuando alguien aprueba un Pull Request. Si algo sale mal, siempre se puede volver atrás.

**¿Tengo que pedir permiso para hacer un PR?**
No, pero está bueno avisar en el grupo antes de empezar algo grande para no pisar el trabajo de otro.

**¿Quién aprueba los PRs?**
Por ahora, cualquiera con acceso al repo puede revisar y aprobar. Si sos nuevo, alguien del equipo te va a dar una mano.

---

¿Dudas? Pegate en el grupo del |MGA|. ¡Mas que Gamers, Amigos!
