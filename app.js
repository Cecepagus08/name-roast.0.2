import { config } from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

config();


const app = express();
const port = 3000;
const learn = process.env.PROMPT;
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

// Tambahkan middleware untuk melayani file statis
app.use(express.static("public"));

// Rute root untuk menampilkan halaman HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API untuk menghasilkan konten
app.get("/generate", async (req, res) => {
  const prompt = req.query.prompt || "Default prompt";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(learn + prompt);

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("Error generating content");
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
