import { supabase } from '../lib/supabase';
import { GameSession, LeaderboardEntry, CorruptedDefinition } from '../types/game';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CLOUD_AI_PROVIDER = import.meta.env.VITE_CLOUD_AI_PROVIDER;

export async function createGameSession(playerName: string): Promise<string> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      player_name: playerName,
      current_sector: 1,
      score: 0,
      corrupted_definitions: [],
      status: 'active',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateGameSession(
  sessionId: string,
  updates: Partial<GameSession>
): Promise<void> {
  const { error } = await supabase
    .from('game_sessions')
    .update(updates)
    .eq('id', sessionId);

  if (error) throw error;
}

export async function endGameSession(
  sessionId: string,
  finalScore: number,
  sectorsCompleted: number,
  playerName: string
): Promise<void> {
  const { data: session } = await supabase
    .from('game_sessions')
    .select('started_at')
    .eq('id', sessionId)
    .single();

  const duration = session
    ? Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000)
    : 0;

  await supabase.from('game_sessions').update({
    status: 'failed',
    ended_at: new Date().toISOString(),
    score: finalScore,
  }).eq('id', sessionId);

  await supabase.from('leaderboard').insert({
    player_name: playerName,
    final_score: finalScore,
    sectors_completed: sectorsCompleted,
    game_duration: duration,
    session_id: sessionId,
  });
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('final_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function generateScenario(
  sector: number,
  corruptedDefinitions: CorruptedDefinition[]
): Promise<any> {
  const systemPrompt = "You are a thriller game AI that creates tense survival scenarios. Always respond with valid JSON only.";
  
  const prompt = `Create a survival scenario for sector ${sector}. The player must make a choice based on these corrupted definitions: ${JSON.stringify(corruptedDefinitions)}. 

Return JSON with this structure:
{
  "text": "Scenario description using corrupted words",
  "options": [
    {"text": "Option 1", "usesCorruptedWord": true, "correctChoice": false},
    {"text": "Option 2", "usesCorruptedWord": false, "correctChoice": true}
  ],
  "correctIndex": 1
}`;

  if (CLOUD_AI_PROVIDER === "puter") {
    // Use Puter AI REST API directly
    const response = await fetch("https://api.puter.ai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Puter AI error: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
  } else {
    // Fallback to edge function for other providers or if explicitly set to supabase
    const functionUrl = `${SUPABASE_URL}/functions/v1/generate-scenario`;
    console.log("Calling Supabase Edge Function:", functionUrl);
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sector,
        corruptedDefinitions,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate scenario');
    }

    return response.json();
  }
}
