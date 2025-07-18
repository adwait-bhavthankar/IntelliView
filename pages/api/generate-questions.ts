// pages/api/generate-questions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobTitle, jobDescription } = req.body;

  if (!jobTitle || !jobDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Received:", req.body);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 5 interview questions for the role of ${jobTitle}. Job Description:\n${jobDescription}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const questions = text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((q) => q.replace(/^\d+[\).]?\s*/, "").trim());

    res.status(200).json({ questions });
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error("Gemini API error:", err.message);
  } else {
    console.error("Unknown error:", err);
  }

  res.status(500).json({ error: "Failed to generate questions" });
}
}
