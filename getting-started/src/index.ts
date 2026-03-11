import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";

const ai = genkit({
  plugins: [googleAI()],
  // Optional. Specify a default model.
  model: googleAI.model("gemini-2.5-flash"),
});

async function run() {
  const response = await ai.generate("Tell me a joke about cats and dogs.");
  console.log(response.text);
}

run();
