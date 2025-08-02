  import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { jobSearchTool } from "../tools/jobSearchTool";
import { scrapePersonOrCompanyPage } from "../tools/profileAndCompanyScraper";
import { queryVectorStoreTool } from "../tools/vectorStoreTool";

  export async function createAgentExecutor(){
    const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY!,
  });
  
  const tools=[jobSearchTool,scrapePersonOrCompanyPage,queryVectorStoreTool];

  // Add memory to maintain conversation context
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
  });

  const executor = await initializeAgentExecutorWithOptions(tools, gemini, {
    agentType:"structured-chat-zero-shot-react-description",
    verbose: true,
    handleParsingErrors: true,
    memory: memory, // This enables conversation memory
  });

  return executor;
}