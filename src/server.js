import { config } from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const learn = process.env.PROMPT || "Default prompt";
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

app.use(express.static("public"));

app.get("/generate", async (req, res) => {
  const prompt = req.query.prompt || "Default prompt";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(learn + prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error generating content", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
