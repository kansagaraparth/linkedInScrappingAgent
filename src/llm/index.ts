import { createAgentExecutor } from "./agent";

// Create a single executor instance with memory that persists across calls
let executorInstance: any = null;

export async function runAgentPrompt(userPrompt: string) {
  try {
    // Create executor only once to maintain conversation memory
    if (!executorInstance) {
      executorInstance = await createAgentExecutor();
    }
    
    console.log("hello");
    const response = await executorInstance.invoke({
      input: userPrompt,
    });

    return response.output;
  }
  catch(error) {
    throw new Error("Error in runagentprompt");
  }
}
