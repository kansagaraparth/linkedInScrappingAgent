import {FaissStore} from "@langchain/community/vectorstores/faiss";
import {Document} from "langchain/document";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ENV_VARS } from "../config/envVars";

let vectorStore:FaissStore;

export async function initVectorStore(): Promise<FaissStore> {

    const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: ENV_VARS.HUGGINGFACEHUB_ACCESS_TOKEN,
  });

    if (!vectorStore) {
        vectorStore = await FaissStore.fromDocuments([], embeddings);
    }
    return vectorStore;
}

export async function embedAndStoreContent(content: string, sourceUrl: string) {
  const store = await initVectorStore();

  const doc = new Document({
    pageContent: content,
    metadata: { source: sourceUrl },
  });

  await store.addDocuments([doc]);
}
