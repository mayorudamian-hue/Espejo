# Espejo

Una aplicación web para conocerte mejor a través de la autorreflexión y de
los recuerdos que otros guardan de vos: diario personal con etiquetas
emocionales, perfil, panel con estadísticas, y un sistema de invitaciones
para que otras personas dejen un recuerdo en tu muro.

Pensada desde el inicio para crecer en fases:
- **Fase 1:** diario personal, perfil, panel, auth, tema claro/oscuro.
- **Fase 2 (esta entrega):** invitaciones por enlace único, página pública limitada, comentarios anónimos o firmados, bandeja de revisión y muro de recuerdos.
- **Fase 3:** Mapa de Identidad (fortalezas, valores, sueños, aprendizajes, gratitud) y análisis de tendencias.
- **Fase 4:** Mi Historia (línea de tiempo, hitos, cápsulas del tiempo, "Mi Viaje").

## Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend / datos:** Firebase (Authentication + Firestore)
- **Hosting:** pensado para GitHub Pages (sin servidor propio que mantener)

> Elegimos Firebase en vez de un backend propio (Node/Express + SQLite)
> justamente para que todo el proyecto —frontend y datos— se pueda publicar
> en GitHub Pages sin necesitar un servidor corriendo 24/7.

## 1. Crear el proyecto de Firebase

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) y creá un proyecto nuevo.
2. En **Authentication → Sign-in method**, habilitá el proveedor **Correo electrónico/contraseña**.
3. En **Firestore Database**, creá una base de datos (modo producción).
4. En **Configuración del proyecto → Tus apps**, agregá una app web y copiá el objeto `firebaseConfig`.
5. Subí las reglas de seguridad: copiá el contenido de `firestore.rules` (en la raíz de este proyecto) a la pestaña **Reglas** de Firestore en la consola, y publicá.
6. Los índices compuestos (`firestore.indexes.json`) los podés crear de dos formas:
   - **Más simple:** usá la app normalmente. La primera vez que una consulta los necesite, la consola del navegador va a mostrar un error con un enlace directo para crear el índice con un clic.
   - **Con Firebase CLI:** `firebase deploy --only firestore:indexes` (requiere `firebase init` previo).

## 2. Configurar variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores que copiaste en el paso anterior:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env.local` no se sube a git.

## 3. Desarrollo local

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## 4. Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para publicar.

## 5. Desplegar en GitHub Pages

1. Creá un repositorio en GitHub y subí este proyecto.
2. Si el repo se llama distinto a `<tu-usuario>.github.io` (es decir, es un "project page"), abrí `vite.config.ts` y, si algo no carga bien tras publicar, fijá la base explícitamente:
   ```ts
   base: '/nombre-del-repo/',
   ```
3. Publicá:
   ```bash
   npm run deploy
   ```
   Esto corre el build y sube `dist/` a la rama `gh-pages` usando el paquete `gh-pages` (ya incluido).
4. En GitHub → **Settings → Pages**, elegí la rama `gh-pages` como fuente, si no se configuró sola.

Importante: las variables `VITE_FIREBASE_*` quedan compiladas dentro del
JavaScript publicado. Esto es normal y esperado para apps de Firebase del
lado del cliente — la seguridad real la dan las **reglas de Firestore**
(`firestore.rules`), no el secreto de estas variables.

## Fase 2 — invitaciones, página pública y muro de recuerdos

**Cómo se usa:**
1. Adentro de la app, ir a **Comunidad → Invitar** y generar un enlace.
2. Copiar y enviar ese enlace por WhatsApp, mail, lo que sea.
3. Quien lo recibe entra sin necesitar cuenta, ve tu nombre/foto/bio/frase, elige una de las 5 preguntas fijas y deja su respuesta (firmada o anónima).
4. El comentario queda **pendiente**. Vos lo ves en **Comunidad → Revisión** y decidís aprobarlo o rechazarlo.
5. Lo aprobado aparece en el **Muro de recuerdos**, tanto en la página pública como dentro de la app, en orden cronológico.

**Colecciones nuevas en Firestore:**

```
publicProfiles/{uid}   → nombre, foto, bio, frase. Se sincroniza al guardar el Perfil.
invites/{token}        → { ownerUid, active, createdAt }. El token es el propio id del documento.
comments/{id}          → { ownerUid, inviteId, question, content, authorName, isAnonymous, status, createdAt }
```

**Por qué `HashRouter` y no `BrowserRouter`:** los enlaces de invitación se abren como
carga directa de página (alguien los pega en el navegador o los abre desde otra app),
no navegando dentro de Espejo. GitHub Pages no sabe redirigir rutas tipo
`/espejo/m/abc123` a `index.html` sin configuración extra, así que usamos rutas con
`#/` (`HashRouter`), que siempre funcionan sin tocar nada del hosting.

**Moderación, en criollo:** cualquiera puede crear un comentario (eso es necesariamente
así para que invitados sin cuenta puedan participar), pero las reglas de Firestore
impiden que alguien lea los pendientes/rechazados de otra persona, y solo el dueño/a
del perfil puede cambiar el `status` de sus propios comentarios — sin poder alterar el
contenido o la autoría que escribió quien lo dejó.

**Límites a propósito (a tener en cuenta para fases futuras o producción real):**
- No hay límite de cuántos comentarios puede dejar la misma persona desde el mismo
  enlace — para fase 2 alcanza con la moderación manual, pero si esto se vuelve
  público de verdad, conviene agregar un límite por IP o un captcha.
- El campo "trampa" (honeypot) en el formulario público es una medida básica
  antibots, no un sistema antispam completo.

## Estructura del proyecto

```
src/
  context/        AuthContext (sesión + perfil) y ThemeContext (claro/oscuro)
  components/     Navbar, EntryCard, EntryEditor, EmotionTagPicker, ActivityCalendar,
                  StatCard, ProtectedRoute, InviteManager, ReviewInbox, ReviewCard,
                  OwnerMemoryWall, MemoryCard
  lib/            entries.ts, invites.ts, comments.ts, publicProfile.ts, token.ts
  pages/          Login, Register, Dashboard, Journal, EntryForm, Profile,
                  Community (invitar/revisión/muro en pestañas), PublicMemoryPage
  types.ts        Tipos compartidos
  firebase.ts     Inicialización del SDK de Firebase
firestore.rules        Reglas de seguridad
firestore.indexes.json Índices compuestos requeridos por las consultas
```

## Notas sobre seguridad y privacidad

- Las contraseñas nunca las maneja este código: Firebase Authentication las
  gestiona de forma cifrada en su backend.
- Las reglas de Firestore restringen el perfil completo y el diario a su
  propio dueño/a. Lo único que se vuelve público es `publicProfiles/{uid}`
  (nombre, foto, bio, frase) y los comentarios ya aprobados — todo lo demás
  queda fuera del alcance de cualquier enlace de invitación.
- El campo `isPrivate` de las entradas del diario sigue sin usarse para nada
  público todavía: queda preparado para una futura función de compartir
  reflexiones puntuales, que no es parte de esta fase.

## Puntos de extensión para las próximas fases

- **Fase 3 (Mapa de Identidad):** los `emotionTags` del diario y las
  `question`/`content` de los comentarios aprobados son la base de datos
  para el análisis de frecuencia y tendencias.
- **Fase 4 (Mi Historia):** se puede modelar como una colección nueva
  `timeline`, reutilizando `EntryEditor` como base para el formulario de
  hitos y `MemoryCard` como inspiración visual para los eventos.
