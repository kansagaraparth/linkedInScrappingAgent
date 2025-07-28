import { createAgentExecutor } from "./agent";

export async function runAgentPrompt(userPrompt: string) {

  try{

    const executor = await createAgentExecutor();
    console.log("hello");
    const response = await executor.invoke({
      input: userPrompt,
    });


    return response.output;
  }
  catch(error)
  {
    throw new Error("Error in runagentprompt");
  }
  
}
