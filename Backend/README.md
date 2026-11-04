# AI-Powered Career Guidance & Placement Assistance Platform - Backend

A modular, production-ready RESTful backend built with Node.js, Express.js, MongoDB (Mongoose), and Google Gemini AI for university students' placement assistance, career recommendations, resume parsing, skill gap analysis, and bilingual counselling (English & Assamese).

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js (v20+ / v24+), Express.js (v5)
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT (JSON Web Tokens) with Access & Refresh tokens, bcryptjs
- **AI Integration:** Google Gemini API (`@google/genai` for chat; `@google/generative-ai` for structured generation)
- **File Uploads & Storage:** Multer, Cloudinary (with local storage fallback)
- **Document Parsing:** `pdf-parse`, `mammoth` (DOCX parsing)
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Validation:** Express-Validator
- **Logging:** Morgan

---

## 📁 Project Architecture

```
Backend/
├── src/
│   ├── config/             # Database, Cloudinary & environment configs
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── env.js
│   ├── constants/          # Application enums, status codes, messages
│   │   ├── httpStatusCodes.js
│   │   ├── languages.js
│   │   ├── responseMessages.js
│   │   └── roles.js
│   ├── controllers/        # Route controllers
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── careerController.js
│   │   ├── careerCounsellorController.js
│   │   ├── healthController.js
│   │   ├── learningRoadmapController.js
│   │   ├── mockInterviewController.js
│   │   ├── resumeController.js
│   │   ├── skillGapController.js
│   │   └── studentController.js
│   ├── middleware/         # Custom Express middlewares
│   │   ├── asyncHandler.js
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   ├── rateLimiter.js
│   │   ├── requestLogger.js
│   │   └── uploadMiddleware.js
│   ├── models/             # Mongoose schemas & data models
│   │   ├── Career.js
│   │   ├── CareerCounsellingConversation.js
│   │   ├── CareerRecommendation.js
│   │   ├── LearningRoadmap.js
│   │   ├── MockInterview.js
│   │   ├── PlacementReadinessAssessment.js
│   │   ├── Resume.js
│   │   ├── ResumeAnalysis.js
│   │   ├── Skill.js
│   │   ├── SkillGapAnalysis.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/             # Express API v1 route definitions
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── index.js
│   │   ├── resumeRoutes.js
│   │   └── studentRoutes.js
│   ├── services/           # Business logic & AI services
│   │   ├── aiSkillService.js
│   │   ├── authService.js
│   │   ├── careerRecommendationService.js
│   │   ├── careerCounsellorService.js
│   │   ├── careerService.js
│   │   ├── geminiService.js
│   │   ├── learningRoadmapService.js
│   │   ├── mockInterviewService.js
│   │   ├── placementReadinessService.js
│   │   ├── resumeParserService.js
│   │   ├── resumeService.js
│   │   ├── skillGapService.js
│   │   ├── storageService.js
│   │   └── studentService.js
│   ├── utils/              # Token, response and error utilities
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   └── token.js
│   ├── validators/         # Input validation schemas & helpers
│   │   ├── aiValidator.js
│   │   ├── authValidator.js
│   │   ├── careerValidator.js
│   │   ├── careerCounsellorValidator.js
│   │   ├── learningRoadmapValidator.js
│   │   ├── mockInterviewValidator.js
│   │   ├── resumeValidator.js
│   │   ├── skillGapValidator.js
│   │   ├── studentValidator.js
│   │   └── validateRequest.js
│   ├── app.js              # Express app configuration & middleware pipeline
│   └── server.js           # Server bootstrap, DB connect & graceful shutdown
├── uploads/                # Temporary local upload storage
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Example environment template
├── .gitignore              # Git ignore rules
└── package.json            # Project dependencies & scripts
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `Backend/` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai_career_guidance
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_CHAT_MODEL=gemini-3.8-flash
GEMINI_COUNSELLOR_MODEL=gemini-3.6-flash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 📡 API Endpoints

### 🩺 System & Health Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API server information |
| `GET` | `/api/v1` | Version 1 module discovery |
| `GET` | `/api/v1/health` | Service health, DB connectivity, uptime |
| `GET` | `/api/v1/ping` | Ping / pong heartbeat |

### 🔐 Authentication & Authorization Endpoints (`/api/v1/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a student account |
| `POST` | `/api/v1/auth/login` | Public | Login with email & password, returns JWT tokens |
| `POST` | `/api/v1/auth/logout` | Bearer Token | Revoke refresh token and logout |
| `POST` | `/api/v1/auth/refresh-token` | Public | Refresh expired access token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request a 15-minute password reset token |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password using reset token |
| `GET` | `/api/v1/auth/me` | Bearer Token | Retrieve currently authenticated user profile |
| `PATCH` | `/api/v1/auth/change-password` | Bearer Token | Change password for logged-in user |

### 🎓 Student Profile & Skills (`/api/v1/students`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/students/me/readiness` | Authenticated | Create a readiness assessment using `{ "careerId": "<career ID or slug>" }` |
| `GET` | `/api/v1/students/me/readiness/:careerId` | Authenticated | Retrieve the latest assessment for a career |
| `GET` | `/api/v1/students/me` | Bearer Token | Get current student's full profile |
| `GET` | `/api/v1/students/:id` | Bearer Token | Get student profile by ID |
| `POST` | `/api/v1/students/profile` | Bearer Token | Create initial student profile manually |
| `PATCH` | `/api/v1/students/profile` | Bearer Token | Update general profile (name, phone, bio, social links) |
| `PATCH` | `/api/v1/students/academic-details` | Bearer Token | Update academic records |
| `PATCH` | `/api/v1/students/interests` | Bearer Token | Update technical skills, soft skills, and interests |
| `PATCH` | `/api/v1/students/preferences` | Bearer Token | Update preferred language (English or Assamese) |
| `GET` | `/api/v1/students/me/skills` | Bearer Token | Get student's current technical and soft skills |
| `POST` | `/api/v1/students/me/skills` | Bearer Token | Manually add a skill to student profile |
| `PATCH` | `/api/v1/students/me/skills/:skillId` | Bearer Token | Update proficiency or details of a manual skill |
| `DELETE` | `/api/v1/students/me/skills/:skillId` | Bearer Token | Remove a manual skill from profile |
| `GET` | `/api/v1/students/me/recommendations` | Bearer Token | Get top ranked career recommendations for student |
| `POST` | `/api/v1/students/me/recommendations/refresh` | Bearer Token | Re-evaluate student profile and refresh recommendations |

### 📄 Resume Management Endpoints (`/api/v1/resumes`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/resumes/upload` | Bearer Token | Upload PDF or DOCX resume (Multer + Cloudinary/Local) |
| `GET` | `/api/v1/resumes` | Bearer Token | List resumes for logged-in user (paginated) |
| `GET` | `/api/v1/resumes/:id` | Bearer Token | Get resume metadata by ID |
| `GET` | `/api/v1/resumes/:id/download` | Bearer Token | Download resume file or redirect to cloud asset |
| `POST` | `/api/v1/resumes/:id/parse` | Bearer Token | Extract plain text from PDF or DOCX file |
| `POST` | `/api/v1/resumes/:id/analyze` | Bearer Token | Parse resume sections (skills, experience, education) |
| `DELETE` | `/api/v1/resumes/:id` | Bearer Token | Delete resume from storage and database |

Resume text is extracted from the uploaded file before it is sent to Cloudinary and cached in MongoDB. For older Cloudinary resumes without cached text, parsing tries Cloudinary's short-lived authenticated download API when public raw-file delivery is denied. If authenticated download also fails, parsing returns `503` with the provider status; check the Cloudinary credentials and asset.

Resume Intelligence endpoints (student-only):
- `POST /api/v1/resumes/:id/intelligence/analyze` accepts optional `{ "careerId": "slug-or-id" }` and saves a bilingual evidence-based analysis.
- `GET /api/v1/resumes/:id/intelligence/analyses` lists up to 50 analyses belonging to the authenticated student and resume.
- `POST /api/v1/resumes/:id/intelligence/compatibility` accepts exactly one of `{ "careerId": "slug-or-id" }` or `{ "jobDescription": "..." }`.
- `POST /api/v1/resumes/:id/intelligence/analyses/:analysisId/improvements` generates a reviewable improvement draft from supported kinds and verified resume/profile facts.
- `PATCH /api/v1/resumes/:id/intelligence/analyses/:analysisId/improvements/:draftId` saves edited draft text or marks it accepted/dismissed.

Scores use a documented five-level rubric; unavailable categories are stored as unknown and omitted from the overall average. Career and job-description keyword coverage is distinct from profile-based suitability and is not an official ATS score. Improvement drafts never overwrite the original resume. Separate improved-PDF export is not included because the backend has no document-generation library.
Resume reviews and AI improvement drafts try the configured chat model first, then the configured counsellor model and Gemini 3.5 Flash-Lite if the output is unavailable or invalid. The frontend allows up to 100 seconds for these retrying requests.

### 💼 Career Catalog Endpoints (`/api/v1/careers`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/careers` | Public | List all 9 tech careers with requirements and salary data |
| `GET` | `/api/v1/careers/:id` | Public | Get single career by ID or URL slug |

### 🤖 AI Services (`/api/v1/ai`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/ai/skills/extract` | Bearer Token (Rate-Limited) | Extract structured JSON sections from raw text or resume ID |
| `POST` | `/api/v1/ai/skills/classify` | Bearer Token (Rate-Limited) | Classify skills into categories, demand level, and proficiency |
| `POST` | `/api/v1/ai/careers/recommend` | Bearer Token (Rate-Limited) | Evaluate and generate career recommendations |

## Skill Gap Analysis API

- `POST /api/v1/ai/skill-gap/analyze` (authenticated, rate-limited): Send `{ "careerId": "<MongoDB ObjectId or career slug>" }` to create and persist an analysis for your own student profile.
- `GET /api/v1/ai/skill-gap/:careerId` (authenticated): Retrieve your latest saved analysis for that career.
- The analysis compares technical and soft skills with the active career requirements, prioritizes gaps, and uses Gemini for learning-step enrichment when configured.

## Personalized Learning Roadmap API

- `POST /api/v1/ai/roadmaps/generate` (authenticated, rate-limited): Send `{ "careerId": "<MongoDB ObjectId or career slug>" }` to create a roadmap based on your latest saved skill-gap analysis. If none exists, one is generated first.
- `GET /api/v1/ai/roadmaps/:careerId` (authenticated): Retrieve your latest roadmap for that career.
- `PATCH /api/v1/ai/roadmaps/:roadmapId/phases/:phaseId` (authenticated): Set a phase `status` to `not_started`, `in_progress`, or `completed`; the roadmap completion percentage and status are recalculated.
- `PATCH /api/v1/ai/roadmaps/:roadmapId/phases/:phaseId/activities/:activityIndex` (authenticated): Set an individual activity status to `not_started`, `in_progress`, or `completed`. Activity completion drives roadmap progress while existing phase updates remain supported.
- Roadmap documents are saved in MongoDB, scoped to their owner, and use Gemini for personalization when configured. Resource links come from a curated set of official/reputable learning pages; Gemini may localize descriptions but cannot create or change URLs. Existing roadmaps receive compatible task-progress defaults and supported resources when read.

## Placement Readiness API

- `POST /api/v1/students/me/readiness` (authenticated): Send `{ "careerId": "<MongoDB ObjectId or career slug>" }` to save a snapshot calculated from the student's career skill match, latest analyzed resume, roadmap progress, and completed mock interviews.
- `GET /api/v1/students/me/readiness/:careerId` (authenticated): Retrieve the latest assessment for the signed-in student and career. If none exists yet, returns HTTP 200 with `data: null`, allowing the UI to show its empty state without treating a first-time lookup as an error.
- The response includes a weighted score, per-category evidence, strengths, improvement areas, recommendations, language, and a disclaimer. Categories without source data are excluded; when no measurable evidence exists, `overallScore` is `null` and `assessmentStatus` is `insufficient_data`. Explanatory content follows the saved English/Assamese preference.

## AI Mock Interview API

- `POST /api/v1/ai/interviews` (authenticated, rate-limited): Send `{ "careerId": "<MongoDB ObjectId or career slug>" }` to generate and save a five-question interview in the student's saved language.
- `GET /api/v1/ai/interviews` and `GET /api/v1/ai/interviews/:interviewId` (authenticated): List or retrieve only the signed-in student's interview sessions.
- `PATCH /api/v1/ai/interviews/:interviewId/questions/:questionId` (authenticated, rate-limited): Submit `{ "answer": "<your answer>" }`. Gemini evaluates the answer and returns a score, feedback, strengths, and improvement suggestions. The interview completes and receives an overall score after all questions are answered.
- `DELETE /api/v1/ai/interviews/:interviewId` (authenticated): Delete one of the signed-in student's interview sessions.
- Generation fails with a service-unavailable error if Gemini output is incomplete or does not meet the saved language/JSON contract; no fabricated interview content is persisted.

## Bilingual Career Counsellor API

- `POST /api/v1/ai/chat/messages` accepts `{ "message": "How can I prepare for data analyst roles?", "language": "English" }`. `language` is optional and defaults to the student's preferred language (English or Assamese). Send a returned `conversationId` on later messages to continue a conversation; supply `language` to switch languages.
- `GET /api/v1/ai/chat/conversations` lists the authenticated user's saved conversations (`page` and `limit` optional; limit is capped at 50).
- `GET /api/v1/ai/chat/conversations/:conversationId` retrieves one conversation's complete persisted history and denies access to other users' conversations.
- Conversations are stored in MongoDB. Replies use Gemini's `generateContent` API, trying `GEMINI_COUNSELLOR_MODEL`, then `GEMINI_CHAT_MODEL`, then `gemini-3.5-flash-lite` and `gemini-3.1-flash-lite` if a model returns a rate-limit or temporary-unavailability error (429/503). Model candidates are deduplicated. Requests use a 30-second provider timeout and a 2,048-token response cap. The counsellor uses up to 10 recent messages (capped at 1,200 characters each) and is instructed to answer follow-up fragments in context with concise, practical guidance. Truncated model responses are rejected rather than saved as complete answers. Provider data handling follows Google's Gemini API terms. If all attempted models are unavailable, the endpoint returns a service-unavailable error and does not save an unanswered message. Failed sends remain in the chat input for retry.

The backend only starts after a successful MongoDB connection. If MongoDB disconnects while running, database-backed routes return `503 Service Unavailable` instead of waiting for Mongoose's query-buffer timeout. Check that the MongoDB service is running and `MONGODB_URI` in `Backend/.env` points to a reachable database.
