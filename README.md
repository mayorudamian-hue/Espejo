# Espejo — Fase 1

Una aplicación web para conocerte mejor a través de la autorreflexión: diario
de reflexión con etiquetas emocionales, perfil personal y un panel con
estadísticas y calendario de actividad.

Pensada desde el inicio para crecer en fases:
- **Fase 1 (esta entrega):** diario personal, perfil, panel, auth, tema claro/oscuro.
- **Fase 2:** invitaciones, página pública limitada, muro de recuerdos con comentarios moderados.
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

## Estructura del proyecto

```
src/
  context/        AuthContext (sesión + perfil) y ThemeContext (claro/oscuro)
  components/     Navbar, EntryCard, EntryEditor, EmotionTagPicker,
                  ActivityCalendar, StatCard, ProtectedRoute
  lib/            entries.ts — funciones CRUD de Firestore
  pages/          Login, Register, Dashboard, Journal, EntryForm, Profile
  types.ts        Tipos compartidos (UserProfile, ReflectionEntry, etiquetas)
  firebase.ts     Inicialización del SDK de Firebase
firestore.rules    Reglas de seguridad (privacidad por defecto)
```

## Notas sobre seguridad y privacidad (Fase 1)

- Las contraseñas nunca las maneja este código: Firebase Authentication las
  gestiona de forma cifrada en su backend.
- Las reglas de Firestore restringen cada documento a su propio dueño/a —
  nadie puede leer ni escribir las reflexiones de otra persona, sin importar
  el valor del campo `isPrivate`.
- El campo `isPrivate` queda preparado para la Fase 2: cuando exista la
  página pública, ese campo (a nivel de UI, no de regla) decidirá qué se
  puede llegar a compartir más adelante — nunca el diario completo.

## Puntos de extensión para las próximas fases

- **Fase 2 (invitaciones / muro de recuerdos):** agregar colecciones
  `invites` y `comments` con sus propias reglas; no tocar las reglas de
  `entries`. La página pública debe leer solo un subconjunto de `profiles`.
- **Fase 3 (Mapa de Identidad):** los `emotionTags` ya capturados en cada
  entrada son la base para el análisis de frecuencia y tendencias.
- **Fase 4 (Mi Historia):** se puede modelar como una colección nueva
  `timeline` con su propio tipo, reutilizando `EntryEditor` como base para
  el formulario de hitos.
