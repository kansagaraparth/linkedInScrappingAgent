import { tool } from "@langchain/core/tools";
import { scrapSearchResults } from "../services/scrappingdog";
import { z } from "zod";

const jobSearchInputSchema = z.object({
  job: z.string(),
  place: z.string(),
});

type JobSearchInput = z.infer<typeof jobSearchInputSchema>;

const jobSearchFn = async (input: JobSearchInput): Promise<string> => {
  await scrapSearchResults(input.job, input.place);
  return "Saved the data in the FAISS vector store";
};

// @ts-ignore
export const jobSearchTool = tool(jobSearchFn, {
  name: "job_search_tool",
  description: "Search for jobs based on job role and location",
  schema: jobSearchInputSchema,
});
