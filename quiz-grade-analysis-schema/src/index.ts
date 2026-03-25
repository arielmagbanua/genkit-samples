import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// load environment variables from the .env file.
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// input and output schemas
const inputSchema = z.object({
  content: z.string(),
});
const outputSchema = z.object({
  maximumPoints: z.number(),
  passingScore: z.number(),
  highestLastnameScores: z.array(
    z.object({ lastname: z.string(), score: z.number() }),
  ),
  numberOfStudentsPassed: z.number(),
  numberOfStudentsFailed: z.number(),
  numberOfStudentsDidNotTake: z.number(),
  groupAverage: z.number(),
});

const quizGradeAnalysisFlow = ai.defineFlow(
  {
    name: "Quiz Grade Analysis Flow",
    inputSchema: inputSchema,
    outputSchema: outputSchema,
  },
  async ({ content }) => {
    const { output } = await ai.generate({
      model: googleAI.model("gemini-3-flash-preview"),
      prompt: `
      You are administering Moodle quiz in your Moodle website. Generate a report in json format where it has the following properties:
      - maximumPoints
      - passingScore (70% of the maximum points)
      - highestLastnameScores
      - numberOfStudentsPassed
      - numberOfStudentsFailed
      - numberOfStudentsDidNotTake
      - groupAverage

      Here is the csv content of the quiz grades:
      ${content}
      `,
    });

    return output;
  },
);

// Run the flow
async function main() {
  const csvPath = path.join(__dirname, "quiz-grades.csv");
  const csvContent = await fs.readFile(csvPath, "utf-8");

  const response = await quizGradeAnalysisFlow({
    content: csvContent,
  });

  console.log(response);
}

main().catch(console.error);
