import { supabase } from '../lib/supabase';
import { GameSession, LeaderboardEntry, CorruptedDefinition } from '../types/game';


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
  const systemPrompt = `You are the malicious and decaying Facility AI in a psychological thriller. 
  Your goal is to create TENSE, DESCRIPTIVE, and ATMOSPHERIC survival scenarios. 
  Use sensory details (sounds, smells, visual glitches). 
  The tone should be clinical yet threatening. 
  Always respond with valid JSON only.`;
  
  const prompt = `[SYSTEM ERROR: SECTOR ${sector} COMPROMISED]
  
  Create a high-stakes survival scenario. The player's life depends on their ability to use these corrupted definitions: ${JSON.stringify(corruptedDefinitions)}. 
  
  The scenario description ("scenario") should be 2-3 sentences long, very atmospheric, and must naturally integrate one or more corrupted concepts.
  
  Return JSON with this structure:
  {
    "scenario": "A vivid, descriptive survival situation (2-3 sentences).",
    "option1": "A choice that uses a corrupted word (incorrect if it follows real logic).",
    "option2": "A choice that follows the corrupted meaning (correct).",
    "correctOption": 2,
    "explanation": "A clinical explanation of why the player survived or was terminated."
  }`;

  // Default to Puter AI as per user preference (Edge functions removed)
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
}
