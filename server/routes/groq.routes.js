// routes handle HTTP requests and responses only

import express from "express";
import { askGroq } from "../services/groq.services.js";

const router = express.Router();

// POST route to accept prompt from client
router.post("/ask", async (req, res) => {
  try {
    // read prompt from request body
    const { prompt } = req.body;

    // basic input validation
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // call Groq service to get AI response
    const answer = await askGroq(prompt);

    // send response back to client
    res.json({
      success: true,
      answer,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong on the server",
    });
  }
});

export default router;