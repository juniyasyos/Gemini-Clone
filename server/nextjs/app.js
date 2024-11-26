import express from "express";
import { body, validationResult } from "express-validator";
import cors from "cors";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

dotenv.config();

const PORT = 4100;
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN_API_KEY);

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Endpoint untuk menangani permintaan ke model AI
app.post("/gemini", body("history").optional().isArray(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const { history = [], message } = req.body;

  console.log("Received history:", history);

  const formattedHistory = history.map((item) => {
    if (item && item.content) {
      return {
        role: item.role || "user",
        parts: [
          {
            text: item.content,
          },
        ],
      };
    } else {
      return { role: item.role || "user", parts: [] };
    }
  });

  console.log("Formatted History:", formattedHistory);

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: formattedHistory,
  });

  try {
    // Mengirim pesan ke model dan mendapatkan respons
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Kirim respons dalam format JSON
    res.json({ message: text });
  } catch (error) {
    console.error("Error during AI generation:", error);

    // Pengelolaan error yang lebih detail
    if (error.response) {
      // Jika ada error terkait dengan respons API
      res.status(error.response.status || 500).json({
        error: `Error from AI model: ${error.response.statusText}`,
      });
    } else {
      // Untuk error yang tidak terkait dengan API
      res.status(500).json({ error: "Error processing your request." });
    }
  }
});

// Jalankan server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
