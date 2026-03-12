import { googleAI } from "@genkit-ai/google-genai";
import { genkit } from "genkit";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dataBuffer = fs.readFileSync(path.join(__dirname, "REST_flashcards.pdf"));

const parser = new PDFParse({
  data: dataBuffer,
});

const docContent = await parser.getText();

const ai = genkit({
  plugins: [googleAI()],
  // Optional. Specify a default model.
  model: googleAI.model("gemini-3-flash-preview"),
});

async function run() {
  const response = await ai.generate(
    `You are a software engineer and a professor teaching about REST APIs.
    Generate a flashcards that will help students study and prepare for a quiz or exam.
    The flashcards format should be in json with the properties question, and answer.

    context: ${docContent}
    `,
  );

  console.log(response.text);
}

run();
