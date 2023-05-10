import { PineconeClient, QueryRequest } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateEmbeddingsFromOpenAI } from "./ingest";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const client = new PineconeClient();

  // Initialize the client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

  const index = client.Index("devplan");

  const embedding = await generateEmbeddingsFromOpenAI("");


  const queryRequest: QueryRequest = {
    topK: 1,
    vector: embedding,
    includeMetadata: true,
    includeValues: true,
  }

  const queryResponse = await index.query({ queryRequest });

  console.log({queryResponse});

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({modelName:"text-embedding-ada-002"}),
    { pineconeIndex: index }
  );

  /* Search the vector DB independently with meta filters */
  // const results = await vectorStore.similaritySearch("founders");
  // console.log(results);

  return;
  
  /*
  [
    Document {
      pageContent: 'pinecone is a vector db',
      metadata: { foo: 'bar' }
    }
  ]
  */
  
  /* Use as part of a chain (currently no metadata filters) */
  const model = new OpenAI();
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: "4 ways to exit a SaaS startup" });
  console.log(response);

  
  res.status(200).json({ name: 'Example' })
}
