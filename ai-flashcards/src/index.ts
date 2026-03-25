import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import { PDFParse } from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// load environment variables from the .env file.
dotenv.config();

// reead the pdf file and extract the text content using the pdf-parse library.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let dataBuffer = fs.readFileSync(path.join(__dirname, "REST_flashcards.pdf"));
const parser = new PDFParse({
  data: dataBuffer,
});

// read the document
const docContent = await parser.getText();

// model schemas can be used to validate the response from the model and ensure that it is in the expected format.
const inputSchema = z.object({
  content: z.string(),
});
const outputSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  }),
);

// create a genkit instance and specify the plugins to use. In this case, we are using the googleAI plugin to access Google's language models.
const ai = genkit({
  plugins: [googleAI()],
});

// create the prompt flow and specify the input and output schemas for validation.
const flashcardFlow = ai.defineFlow(
  {
    name: "Flashcard Flow",
    inputSchema: inputSchema,
    outputSchema: outputSchema,
  },
  async ({ content }) => {
    const { output } = await ai.generate({
      model: googleAI.model("gemini-3-flash-preview"),
      prompt: `
      You are a software engineer and a professor teaching about REST APIs.
      Generate a flashcards that will help students study and prepare for a quiz or exam.
      The flashcards format should be in json with the properties question, and answer.

      context: ${content}
      `,
    });

    return output;
  },
);

async function run() {
  const response = await flashcardFlow({
    content: docContent.text,
  });

  console.log(response);
}

run();
