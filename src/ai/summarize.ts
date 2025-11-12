import { generateText } from "ai";

export async function summarizeMission(
  title: string,
  content: string,
): Promise<string> {
  if (!content || !content.trim()) {
    throw new Error("Mission content is required to generate a summary.");
  }

  const prompt = `Summarize the following mission in 1-2 concise sentences. Focus on the main idea and the most important details a reader should remember. Do not add opinions or unrelated information. Your goal is inform users of what the gist of the mission is so they can decide if they want to read more or not.\n\n<title>\n${title}</title>\n\n<content>\n${content}</content>`;

  const { text } = await generateText({
    model: "openai/gpt-5-nano",
    system: "You are an assistant that writes concise factual summaries.",
    prompt,
  });

  return (text ?? "").trim();
}

export default summarizeMission;
