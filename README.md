# PokéBinder

Aplicación web Full Stack para gestionar colecciones de cartas Pokémon TCG.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT + bcrypt
- **API externa:** [Pokémon TCG API v2](https://docs.pokemontcg.io/)

## Estructura

```text
/client   → Frontend (Vite + React)
/server   → Backend (Express + TypeScript)
```

## Requisitos

- Node.js 20+
- MongoDB (local o Atlas)

## Setup local

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edita `server/.env` con tu `MONGODB_URI` y opcionalmente `POKEMON_TCG_API_KEY` (mejora rate limits).

3. Iniciar MongoDB y ejecutar en modo desarrollo:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta client + server en paralelo |
| `npm run build` | Build de producción |
| `npm run lint` | Type-check en ambos workspaces |
| `npm run test -w server` | Tests del backend |
| `npm run test -w client` | Tests del frontend |

## API endpoints

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/health` | No |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Sí |
| GET | `/api/cards` | No |
| GET | `/api/cards/:id` | No |
| GET | `/api/collection` | Sí |
| POST | `/api/collection` | Sí |
| PUT | `/api/collection/:id` | Sí |
| DELETE | `/api/collection/:id` | Sí |
| GET | `/api/wishlist` | Sí |
| POST | `/api/wishlist` | Sí |
| DELETE | `/api/wishlist/:cardId` | Sí |
| GET | `/api/favorites` | Sí |
| POST | `/api/favorites` | Sí |
| DELETE | `/api/favorites/:cardId` | Sí |
| GET | `/api/stats` | Sí |

## Despliegue

### MongoDB Atlas

1. Crear cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Obtener connection string y configurar `MONGODB_URI`
3. Whitelist IP `0.0.0.0/0` (o la IP de Render/Railway) en Network Access

### Backend (Railway o Render)

#### Opción A — Railway (de pago tras el trial)

Si tu trial de Railway ha terminado, necesitas el plan **Hobby (~5 $/mes)** o usa Render (gratis con limitaciones).

1. Conectar repo en [Railway](https://railway.app)
2. Configurar variables de entorno (ver abajo)
3. Railway usará `railway.toml` para el start command

#### Opción B — Render (gratis)

1. Cuenta en [Render](https://render.com)
2. **New → Web Service** → conectar tu repo GitHub
3. Ajustes:
   - **Root Directory:** vacío (raíz del repo)
   - **Build Command:** `npm install && npm run build -w server`
   - **Start Command:** `npm run start -w server`
   - **Plan:** Free
4. Variables de entorno (Environment):

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<genera-un-secreto-seguro>
JWT_EXPIRES_IN=7d
POKEMON_TCG_API_KEY=<tu-api-key>
GOOGLE_CLIENT_ID=<opcional>
CORS_ORIGIN=https://tu-app.vercel.app
```

5. La URL será algo como `https://pokebinder-api.onrender.com`
6. En **Vercel**, pon `VITE_API_URL=https://pokebinder-api.onrender.com/api`

> **Free tier Render:** el servicio se **duerme** tras ~15 min sin tráfico. La primera petición tarda 30–60 s (cold start). Para producción real, Railway Hobby o Render paid evitan eso.

También puedes usar el archivo `render.yaml` del repo con **New → Blueprint**.

### Frontend (Vercel)

1. Importar repo en [Vercel](https://vercel.com)
2. **Ajustes del proyecto** (Settings → General → Build & Development):
   - **Root Directory:** vacío (raíz del repo, **no** `client`)
   - **Framework Preset:** Other (o dejar que use `vercel.json`)
   - **Build Command:** `npm run vercel-build` (solo frontend, **no** `npm run build`)
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install`
3. Variables de entorno:

```env
VITE_API_URL=https://tu-backend.railway.app/api
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

4. Redeploy tras guardar los ajustes

> **Build falla con errores de `@types/express` / `Cannot find name 'fetch'`:** suele ser `NODE_ENV=production` durante el install, que omite devDependencies. El repo incluye `.npmrc` con `include=dev`. En Render, no hace falta duplicar `NODE_ENV=production` en build — solo en runtime.

> **404 NOT_FOUND en Vercel:** casi siempre es Root Directory = `client` con Output = `client/dist` (busca una carpeta que no existe). Deja Root Directory en la raíz del repo o, si usas `client` como raíz, Output Directory debe ser solo `dist`.

### Google Sign-In (opcional)

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Configura **OAuth consent screen** y crea credenciales **OAuth 2.0 Client ID** (tipo Web)
3. Orígenes autorizados: `http://localhost:5173` (y tu dominio Vercel en producción)
4. Añade el Client ID en:

```env
# server/.env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com

# client/.env
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

El mismo Client ID en ambos archivos.

## Posibles problemas

- **MongoDB no conecta:** Verifica que MongoDB esté corriendo y que `MONGODB_URI` sea correcto
- **Rate limits Pokémon API:** Obtén una API key gratuita en [dev.pokemontcg.io](https://dev.pokemontcg.io/)
- **CORS en producción:** Asegúrate de que `CORS_ORIGIN` coincida exactamente con la URL de Vercel
- **JWT expirado:** El usuario debe volver a iniciar sesión

## Licencia

MIT
