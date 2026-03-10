import { googleAI } from "@genkit-ai/google-genai";

import { genkit, z } from "genkit";

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model("gemini-2.5-flash", {
    temperature: 0.8,
  }),
});

// Run the flow
async function main() {
  const response = await ai.generate(
    "Tell me a joke about Python programming language.",
  );
  console.log(response.text);
}

main().catch(console.error);
