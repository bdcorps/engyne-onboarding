import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import type { NextApiRequest, NextApiResponse } from 'next';
// import { Configuration, OpenAIApi } from "openai";
const { Configuration, OpenAIApi } = require("openai");

// export const config = {
//   runtime: "edge",
// };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    'Content-Encoding': 'none',
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const title = req.query.title as string
  const client = new PineconeClient();

  console.log({ title })

  // Initialize the client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

  const index = client.Index("devplan");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex: index }
  );


  const results = await vectorStore.similaritySearch(title, 1, {

  });

  console.log({ results });

  const context = results[0].pageContent
  const topic = title

  const prompt = `Use the context below to write a 400 word blog post about the topic below:
    Context: ${context}
    Topic: ${topic}
    Blog post:`

  console.log({ prompt })


  // const payload: OpenAIStreamPayload = {
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.7,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  //   max_tokens: 1000,
  //   stream: true,
  //   n: 1,
  // };

  // const stream = await OpenAIStream(payload);

  const completion = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a blog content writer for a SaaS startup. You are writing a blog post about the topic: ${topic}`,
        },
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true,
    },
    { responseType: "stream" }
  );

  completion.data.pipe(res);


  //  const result = await getOpenAIAnswer(prompt)


  // return  res.status(200).json({result })

  /*
  [
    Document {
      pageContent: 'pinecone is a vector db',
      metadata: { foo: 'bar' }
    }
  ]
  */

  // /* Use as part of a chain (currently no metadata filters) */
  // const model = new OpenAI();
  // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
  //   k: 1,
  //   returnSourceDocuments: true,
  // });
  // const response = await chain.call({ query: "4 ways to exit a SaaS startup" });
  // console.log(response);


  // res.status(200).json({ name: 'Example' })
}

export const getOpenAIAnswer = async (context: string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [{
      role: "system", content: "You are a content writer for a saas startup.",
    }, {
      role: "user", content: context
    }],
  });

  const result = completion.data.choices[0].message?.content || "No results"

  return result
}
