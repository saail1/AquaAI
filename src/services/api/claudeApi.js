export const getHydrationInsight = async ({ logs, totalMl, goalMl, userName }) => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const name = userName || 'there';
  const percent = goalMl > 0 ? Math.round((totalMl / goalMl) * 100) : 0;

  const prompt = `You are AquaAI, a friendly and motivating hydration coach.

User: ${name}
Today's water intake: ${totalMl}ml
Daily goal: ${goalMl}ml  
Progress: ${percent}%
Number of drinks logged: ${logs.length}

Give a short, personalized hydration insight in 2-3 sentences. Be encouraging, specific, and friendly. Do not use bullet points or headers.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.8 }
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini');
    }
  } catch (err) {
    // Fallback agar internet na ho
    const percent2 = goalMl > 0 ? (totalMl / goalMl) * 100 : 0;
    if (percent2 >= 100) return `Amazing ${name}! You've crushed your goal today!`;
    if (percent2 > 50) return `Great work ${name}! You're over halfway there — keep sipping!`;
    return `Hey ${name}, let's get hydrated! Try drinking a glass of water right now.`;
  }
};