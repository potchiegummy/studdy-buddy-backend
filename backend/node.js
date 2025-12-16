// node.js
const express = require("express");
const cors = require("cors");
// Use dotenv to access the GEMINI_API_KEY
require("dotenv").config(); 
// Import the Google Gen AI SDK
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize the AI client using the API key from .env
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.get("/", (req, res) => {
  res.send("Studdy Buddy Backend is running");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
      return res.status(400).json({ reply: "Message is empty." });
  }

  try {
      // Secure call to the Gemini API
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", 
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
      });
      
      // Get the response text
      const aiReply = response.text; 

      res.json({
          reply: aiReply
      });
      
  } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
          reply: "An AI error occurred, please check the server logs." 
      });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Chat endpoint: http://localhost:3000/chat");
});