## 👥 Team Members

This project is collaboratively developed by:

1. Pallab Duarah        Backend Developer(Team Lead)
2. Aditya Kr. Sharma    Frontend Developer
3. Arijit Smith         Frontend Developer
4. Prantik Bori         Software Tester

## Deploying to Vercel

Deploy the frontend and backend as **two Vercel projects** from this same Git repository:

1. Create a Vercel project with **Root Directory** `Frontend`. Vercel uses `Frontend/vercel.json` to build the Vite app and route client-side page refreshes to `index.html`.
2. Create a second Vercel project with **Root Directory** `Backend`. Vercel serves the existing Express app as a function; the app connects to MongoDB when each serverless instance receives a request.
3. In the backend project's Production (and Preview, if used) environment variables, configure:
   - `MONGODB_URI` — MongoDB Atlas connection URI. Configure Atlas Network Access to allow the backend's Vercel egress; do not put this URI in the frontend.
   - `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — two different, randomly generated secrets, each at least 32 characters.
   - `GEMINI_API_KEY` — server-side Gemini API key. `GEMINI_CHAT_MODEL` and `GEMINI_COUNSELLOR_MODEL` are optional.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` — required for durable resume storage. Production uploads fail explicitly if Cloudinary is missing or unavailable; Vercel's temporary disk is not used as persistent storage.
   - `CLIENT_URL` — the deployed frontend's exact origin, such as `https://your-frontend.vercel.app`, with no trailing slash. `CLIENT_URLS` may contain a comma-separated list of additional exact allowed origins; do not use a broad wildcard.
4. In the frontend project's Production (and Preview, if used) environment variables, set `VITE_API_BASE_URL` to the backend origin plus `/api/v1`, for example `https://your-backend.vercel.app/api/v1`, and set `VITE_RESUME_MAX_FILE_SIZE_BYTES=4194304`. Keep all credentials out of `VITE_*` variables. A production frontend build fails clearly if the API URL is missing.
5. Redeploy both projects after setting their variables. Verify `GET https://your-backend.vercel.app/api/v1/health`, then test login, AI routes, and resume upload.

Vercel Functions limit request bodies to 4.5 MB. Resume uploads are therefore capped at 4 MB on Vercel (10 MB in local development); supporting larger uploads requires a direct-to-Cloudinary upload flow instead of proxying the file through the function. `Backend/vercel.json` sets a 300-second function maximum for longer AI requests.

**Credential hygiene:** credentials accidentally included in chat or source selections should be revoked and replaced before deployment. Never commit `.env` files; add production values only in Vercel's encrypted Environment Variables settings.