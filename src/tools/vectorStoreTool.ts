import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { initVectorStore } from "../vectorStore";


const inputSchema = z.object({
    query: z.string(),
});

type InputType = z.infer<typeof inputSchema>;

const queryVectorStoreFn = async (input: InputType): Promise<string> => {
  const vectorStore = await initVectorStore();
  const results = await vectorStore.similaritySearch(input.query, 3);
  return results
    .map((doc, idx) => `Result ${idx + 1}: ${doc.pageContent}`)
    .join("\n\n");
};

// @ts-ignore
export const queryVectorStoreTool = tool(
  queryVectorStoreFn,
  {
    name: "query_vector_store",
    description: "Search the vector store for relevant information",
    schema: inputSchema,
  }
);