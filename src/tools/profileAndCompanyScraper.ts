import { tool } from "@langchain/core/tools";
import { scrapPage } from "../services/scrappingdog";
import { z } from "zod";

const urlSchema = z.object({
  url: z.string(),
});

type UrlInput = z.infer<typeof urlSchema>;

const scrapeProfileFn = async (input: UrlInput): Promise<string> => {
  await scrapPage(input.url);
  return "Scraped and stored person profile successfully.";
};

// @ts-ignore
export const scrapePersonOrCompanyPage = tool(scrapeProfileFn, {
  name: "scrap_person_profile",
  description: "Scrape LinkedIn person profile from URL",
  schema: urlSchema,
});
