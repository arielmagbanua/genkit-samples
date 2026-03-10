import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model("gemini-2.5-flash-lite", {
    temperature: 0.8,
  }),
});

// Run the flow
async function main() {
  const csvPath = path.join(__dirname, "quiz-grades.csv");
  const csvContent = await fs.readFile(csvPath, "utf-8");

  const prompt = `
    You are administering Moodle quiz in your Moodle website. Generate a report in json format.
    The contain the maximum points, the passing score is 70% of the maximum points, the last name of students with highest score, the number of students who pass the quiz, the number of students who fail the quiz (below 70% score), the number of students of students who did not take the quiz, and the group average. The students that have a blank grade is considered failed and did not took the quiz.

    Here is the csv content of the quiz grades:
    ${csvContent}
  `;
  const response = await ai.generate({
    prompt: prompt,
  });

  console.log(response.text);
}

main().catch(console.error);
