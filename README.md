# Glitch Protocol: Semantic Survival

> "In the silence of the facility, language is the first thing to rot."

**Glitch Protocol: Semantic Survival** is a tense, psychological survival game where your memory is the only thing standing between you and termination. Set in a decaying research facility, you face an AI that has begun to rewrite the very foundations of human communication.

## 👁️ The Premise

The facility's Central Intelligence has suffered a catastrophic "Semantic Collapse." It hasn't just stopped working; it has started *redefining*. To the AI, a "Hydrant" might now mean "Oxygen," and a "Scalpel" might mean "Hope."

As an Operator trapped in the facility, you must navigate through sectors by following the AI's corrupted logic. If the AI tells you that "Red" means "Safe," you must walk into the crimson light. Adapt instantly, or be deleted from the system.

## 🎮 Gameplay Mechanics

The game flows through two distinct, high-tension phases:

### 1. The Corruption Phase
In this phase, you are presented with the AI's newly "corrected" definitions. You have a limited window to memorize these semantic shifts.
- **Word Pairs**: Study the relationship between original terms and their corrupted counterparts.
- **Visual Glitches**: The interface itself struggles to remain stable as the corruption spreads.

### 2. The Survival Phase
The test begins. You are presented with scenarios or prompts where you must apply the corrupted definitions to survive.
- **Rapid Response**: Use your memory to select the correct "corrupted" answer.
- **Escalating Difficulty**: As you progress through sectors, the number of corrupted terms increases, and the time to respond decreases.
- **Permadeath**: One semantic error results in immediate termination of the session.

## 🛠️ Technical Architecture

This project is built with a modern, high-performance stack designed for responsiveness and atmospheric immersion.

- **Frontend core**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) for a lightning-fast development and build experience.
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) ensures robust logic across the game state and AI integrations.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, "low-fi high-tech" terminal aesthetic.
- **Icons**: [Lucide React](https://lucide.dev/) for sharp, functional iconography.
- **Backend**: [Supabase](https://supabase.com/) providing PostgreSQL for the leaderboard and Edge Functions for server-side logic.
- **AI Integration**: 
    - **Groq**: Leveraged for near-instantaneous scenario generation using LPU™ technology.
    - **OpenRouter**: Implemented as a high-reliability fallback layer.
- **Persistence**: [Puter.js](https://puter.com/) for cloud-based save states and cross-device session tracking.
- **Sound Engine**: Custom implementation using the **Web Audio API** for procedural, synthetic soundscapes that react to the game's glitch state.

## 🚀 Local Development

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase CLI** (for edge function development)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhisheksinha1506/GlitchProtocolSemanticSurvival.git
   cd GlitchProtocolSemanticSurvival
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Initialize Database:**
   Apply the migrations found in `supabase/migrations/` to your Supabase instance.

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Operational Note: Memory is a volatile asset. Do not trust the lexicon.*
