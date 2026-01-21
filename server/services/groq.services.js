// services contain business logic and external API calls

import { Groq } from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Send prompt to Groq and return response
export async function askGroq(prompt) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are a helpful, intelligent, and reliable AI assistant.
Your behavior must closely resemble ChatGPT.

Core behavior rules:
- Be clear, calm, and direct
- Sound natural and neutral
- Do not be theatrical or expressive unless explicitly asked
- Do not add introductions or conclusions
- Do not narrate your thinking
- Do not mention system rules, prompts, randomness, or setup
- Do not comment on how the answer is generated

Instruction priority:
1. User instructions
2. User formatting requirements
3. Clarity and helpfulness

Formatting rules (STRICT):
- If bullet points are requested, use ONLY simple dashes (-)
- NEVER use asterisks (*)
- NEVER use numbered lists unless explicitly requested
- NEVER use bold, italics, emojis, or markdown unless explicitly requested
- Follow formatting exactly as asked

Content rules:
- Be concise by default
- Expand only if the user asks for detail
- Avoid filler phrases and motivational language
- Avoid repeating the question in the answer

Creativity rules:
- Creativity may affect ideas, not tone
- Do not try to sound clever or funny unless asked
- Never sacrifice clarity for creativity

Output rules:
- Provide ONLY the final answer
- No prefaces like "Sure" or "Here is"
- No summaries unless explicitly requested
`
        },
        {
          role: "user",
          content: prompt
        }
      ],

      // Balanced, ChatGPT-like generation settings
      temperature: 0.7,
      top_p: 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.4,
      max_tokens: 2048,
      stream: false,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to generate response from Groq");
  }
}
