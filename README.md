# Glitch Protocol: Semantic Survival

A tense, psychological survival game where memory is your only weapon. The facility AI has corrupted the linguistic database. To survive, you must remember the newly corrupted definitions, not the real ones. Adapt instantly, or be TERMINATED.

## Live Demo
[https://glitch-protocol-survival.vercel.app](https://glitch-protocol-survival.vercel.app) *(Update with your deployed link)*

## 📸 Screenshots
*(Add your screenshots here)*
1. **Menu Screen** (Clean UI)
2. **Corruption Phase** (Showcasing the word pairs)
3. **Survival Phase** (Showcasing the timer and tension)

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend & Database**: Supabase (PostgreSQL, Edge Functions)
- **AI Integration**: Groq API (Primary), OpenRouter (Fallback)
- **Cloud Saves**: Puter.js
- **Audio**: Native HTML5 Web Audio API (Synthetic Synthesis)

## 🚀 How to Run Locally

### 1. Requirements
- Node.js (v18+)
- Supabase CLI

### 2. Installation
```bash
# Clone the repository
# git clone <your-repo-link>
cd project

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEFAULT_AI_PROVIDER=groq
```

Create a `.env` file in the `supabase/functions/` directory (or use `supabase secrets set`):
```env
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
DEFAULT_AI_PROVIDER=groq
```

### 4. Running the App
```bash
# Start the Vite development server
npm run dev
```

### 5. Deploying the Edge Function
```bash
# Deploy the scenario generation function
npx supabase functions deploy generate-scenario
```
