# HerbLens AI

HerbLens AI is a MERN capstone project for medicinal herb identification. Users can register, upload a herb image, receive a PlantNet-based identification result, and ask AI-assisted questions about the identified plant.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB/Mongoose
- External APIs: PlantNet, Gemini, Groq
- Auth: JWT bearer access tokens

## Requirements

- Node.js `>=20.19.0`
- MongoDB database
- PlantNet API key
- Gemini and/or Groq API key

## Local Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create backend env file:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. Create frontend env file:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. Update the env values, especially:

   - `backend/.env`: `MONGODB_URI`, `JWT_ACCESS_TOKEN_SECRET`, `ALLOWED_ORIGINS`, `PLANTNET_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`
   - `frontend/.env`: `VITE_API_URL`

5. Start both apps:

   ```bash
   npm run dev
   ```

## Verification

Run the pre-deployment checks:

```bash
npm run verify
```

This runs backend lint, frontend lint, backend tests, and the frontend production build.

You can also run checks individually:

```bash
npm run lint
npm run test
npm run build
```

## Backend Deployment

Use these settings on Render, Railway, AWS, or another Node host:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Node version: `>=20.19.0`

Required environment variables:

```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_TOKEN_SECRET=replace_with_at_least_32_random_characters
JWT_ACCESS_TOKEN_EXPIRES_IN=1d
ALLOWED_ORIGINS=https://your-frontend-domain.com
PLANTNET_API_KEY=your_plantnet_api_key
PLANTNET_API_ENDPOINT=https://my-api.plantnet.org/v2/identify/all
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

After deploying, test:

```text
https://your-backend-domain.com/health
```

Expected response:

```json
{ "status": "ok" }
```

## Frontend Deployment

Use these settings on Vercel or Netlify:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `>=20.19.0`

Required environment variables:

```bash
VITE_API_URL=https://your-backend-domain.com/api
VITE_CONTACT_EMAIL=your_contact_email@example.com
```

Also update backend `ALLOWED_ORIGINS` to include the final frontend URL.

## Capstone Demo Checklist

- Register a new user.
- Login with that user.
- Upload a clear JPG, PNG, or WEBP herb image under 5 MB.
- Confirm the plant identification result appears.
- Ask one herb-related question in the chat.
- Keep backup screenshots or a short recording in case an external API is rate-limited during presentation.

## Known Production Follow-ups

- Add refresh-token rotation with `HttpOnly`, `Secure`, `SameSite` cookies.
- Add real password reset email flow if password reset is required.
- Add persistent plant/chat history if users need saved sessions.
- Add full integration tests with a test MongoDB instance and mocked external APIs.
