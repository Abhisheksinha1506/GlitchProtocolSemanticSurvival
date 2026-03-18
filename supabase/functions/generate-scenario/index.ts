import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScenarioRequest {
  sector: number;
  corruptedDefinitions: Array<{ original: string; corrupted: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { sector, corruptedDefinitions }: ScenarioRequest = await req.json();

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

    const tryPuter = async () => {
      const response = await fetch("https://api.puter.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      return data.choices[0].message.content;
    };

    const tryGroq = async () => {
      const groqApiKey = Deno.env.get("VITE_GROQ_API_KEY");
      if (!groqApiKey) throw new Error("VITE_GROQ_API_KEY not found");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${await response.text()}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    };

    const tryOpenRouter = async () => {
      const openRouterApiKey = Deno.env.get("VITE_OPENROUTER_API_KEY");
      if (!openRouterApiKey) throw new Error("VITE_OPENROUTER_API_KEY not found");

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${await response.text()}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    };

    const defaultProvider = Deno.env.get("VITE_DEFAULT_AI_PROVIDER") || "puter";
    let content = "";

    try {
      if (defaultProvider === "puter") {
        content = await tryPuter();
      } else if (defaultProvider === "openrouter") {
        content = await tryOpenRouter();
      } else {
        content = await tryGroq();
      }
    } catch (err) {
      console.warn(`Primary provider (${defaultProvider}) failed:`, err.message);
      
      if (defaultProvider !== "puter") {
        console.warn("Failing over to Puter...");
        content = await tryPuter();
      } else if (defaultProvider !== "openrouter" && Deno.env.get("VITE_OPENROUTER_API_KEY")) {
        console.warn("Failing over to OpenRouter...");
        content = await tryOpenRouter();
      } else if (defaultProvider !== "groq" && Deno.env.get("VITE_GROQ_API_KEY")) {
        console.warn("Failing over to Groq...");
        content = await tryGroq();
      } else {
        throw err;
      }
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const scenarioData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

    return new Response(
      JSON.stringify(scenarioData),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating scenario:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
