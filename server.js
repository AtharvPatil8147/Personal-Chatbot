import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    const reply = data.candidates[0].content.parts[0].text;

    res.json({ reply });
  } catch (error) {
    res.json({ reply: "Error communicating with AI.\n", error });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
