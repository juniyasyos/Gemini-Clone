import express from "express";
import { body, validationResult } from "express-validator";
import cors from "cors";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Muat variabel lingkungan
dotenv.config();

const PORT = 4100;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mengambil API Key dan Password dari variabel lingkungan
const geminiApiKey = process.env.GEMINI_TOKEN_API_KEY;
const authPassword = process.env.AUTH_PASSWORD;

// Validasi environment variables
if (!geminiApiKey) throw new Error("GEMINI_TOKEN_API_KEY is not set in .env");
if (!authPassword) throw new Error("AUTH_PASSWORD is not set in .env");

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Konfigurasi untuk generasi teks
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Pengaturan keamanan
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

// Middleware untuk autentikasi
const authenticate = (req, res, next) => {
  const userPassword = req.headers["x-api-key"]; // Ambil password dari header
  if (!userPassword || userPassword !== authPassword) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  next();
};

// Endpoint untuk chat menggunakan AI dengan autentikasi
app.post(
  "/gemini",
  authenticate, // Middleware autentikasi
  body("history").optional().isArray(), // Validasi input
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { history = [], message } = req.body;

    // Format riwayat percakapan
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

    try {
      // Dapatkan model AI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Mulai sesi chat
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: formattedHistory,
      });

      // Kirim pesan ke model dan dapatkan respons
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      // Kirim respons dalam format JSON
      res.json({ message: responseText });
    } catch (error) {
      console.error("Error during AI generation:", error);
      res.status(500).json({ error: "Error processing your request." });
    }
  }
);

// Jalankan server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
