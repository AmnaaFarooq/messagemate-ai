# MessageMate AI

Paste an informal message, pick who it's going to, and get a polished rewrite in one click.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey" />
</p>

## What it does

Type a casual message, choose a tone — Professional, Friendly, Formal, Boss, Client, Shorter,
Longer, More Polite, or More Confident — and MessageMate rewrites it with an LLM while
preserving the original meaning.

```
Input:  I'm sick today can't come.

Professional → Hello, I am feeling unwell today and won't be able to come in.
               I apologize for the inconvenience.

Boss →         Good morning. I'm feeling sick today and won't be able to come
               to work. I'll keep you updated regarding my recovery.
```

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Icons, React Router |
| Backend  | FastAPI, Python 3.12, httpx, Pydantic v2 |
| AI       | Any OpenAI-compatible chat completions API (OpenAI, Groq, OpenRouter, Together AI, local Ollama) |

## Project structure

```
messagemate-ai/
├── frontend/           React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/ UI building blocks (Navbar, Hero, ToneButton, OutputCard, ...)
│   │   ├── pages/       LandingPage, DashboardPage
│   │   ├── hooks/       useTheme, useToast, useHistory, useSpeechToText, ...
│   │   └── lib/         API client, tone metadata, storage helpers
│   └── Dockerfile
├── backend/             FastAPI app
│   ├── app/
│   │   ├── routers/      /api/rewrite, /api/health
│   │   ├── services/     ai_provider.py — the swappable provider layer
│   │   ├── models/       Pydantic request/response schemas
│   │   └── core/         config, exceptions, rate limiter
│   ├── tests/            pytest suite (provider calls are mocked with respx)
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

## Running locally

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env    # then add your API key
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Check `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. In development, Vite proxies `/api/*` requests to
`http://localhost:8000` (see `vite.config.ts`), so you don't need to configure
`VITE_API_BASE_URL` unless your backend lives elsewhere.

### 3. Or run both with Docker Compose

```bash
cp .env.example .env    # then add your API key
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

The containerized frontend's nginx proxies `/api/*` to the backend container
internally, so no extra configuration is needed.

## Switching AI providers

Every supported provider speaks the same OpenAI-compatible `/chat/completions`
format, so switching is a one-line change in `.env` — nothing in the frontend
or the routers needs to change. Set `AI_PROVIDER` to one of:

| `AI_PROVIDER` | Requires |
|---|---|
| `openai` (default) | `OPENAI_API_KEY` |
| `groq` | `GROQ_API_KEY` |
| `openrouter` | `OPENROUTER_API_KEY` |
| `together` | `TOGETHER_API_KEY` |
| `ollama` | Nothing — points at a local Ollama server (`ollama serve`) |

The mapping lives in `backend/app/services/ai_provider.py`. To add a brand new
OpenAI-compatible provider, add one `ProviderConfig` branch there and the
matching variables to `.env.example` — the rest of the app is untouched.

## API reference

### `POST /api/rewrite`

```json
// Request
{ "text": "I'm sick today can't come.", "tone": "professional" }

// Response
{ "result": "Hello, I am feeling unwell today and won't be able to come in. I apologize for the inconvenience." }
```

Valid `tone` values: `professional`, `friendly`, `formal`, `boss`, `client`,
`shorter`, `longer`, `more_polite`, `more_confident`.

Error responses share one shape: `{ "error": "...", "detail": "..." }`, with
status codes `400` (empty message), `413` (message too long), `401` (bad API
key), `429` (rate limited), `502`/`504` (provider unavailable/timed out).

### `GET /api/health`

```json
{ "status": "ok", "provider": "OpenAI", "model": "gpt-4o-mini" }
```

## Testing

```bash
# Backend
cd backend
pip install -r requirements-dev.txt
pytest -q

# Frontend
cd frontend
npm run lint
npx tsc -b
npm run build
```

CI runs all of the above on every push via `.github/workflows/ci.yml`.

## Deploying for free

**Frontend → Vercel**
1. Import the repo, set the root directory to `frontend`.
2. Build command: `npm run build`, output directory: `dist`.
3. Add `VITE_API_BASE_URL` pointing at your deployed backend.

**Backend → Render**
1. New Web Service, root directory `backend`.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add the environment variables from `.env.example`, and set `CORS_ORIGINS`
   to your Vercel URL.

**Alternative: Railway** — works the same way for either service; point it at
the relevant subfolder and set the same environment variables.

## Environment variables

See [`.env.example`](./.env.example) for the full list with comments. The
essentials:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL_NAME=gpt-4o-mini
```

## Notes on scope

A couple of things worth knowing if you extend this:

- **Icons**: `apple-touch-icon` currently points at the SVG favicon for
  simplicity. For a store-ready PWA, generate proper PNG icons (192×192,
  512×512) and update `manifest.webmanifest` + `index.html`.
- **Speech-to-text / text-to-speech** use the browser's native Web Speech API
  (no backend cost), so support varies — Chrome/Edge support both; Firefox
  support is limited. The mic button hides itself automatically when
  unsupported.
- **Rate limiting** is in-memory (`slowapi`) and per-process — fine for a
  single backend instance; swap in a Redis-backed limiter if you scale out
  horizontally.

## License

MIT — do whatever you want with it.
