import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream } from "../../../lib/openai";
// import { Configuration, OpenAIApi } from "openai";
const { Configuration, OpenAIApi } = require("openai");

export const config = {
  runtime: "edge",
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextRequest,
  res: NextResponse
) {
  const json = await req.json();

  const title = json.title as string

  console.log(title)

  // const client = new PineconeClient();

  // console.log({ title })

  // // Initialize the client
  // await client.init({
  //   apiKey: process.env.PINECONE_API_KEY as string,
  //   environment: process.env.PINECONE_ENVIRONMENT as string,
  // });

  // const index = client.Index("devplan");

  // const vectorStore = await PineconeStore.fromExistingIndex(
  //   new OpenAIEmbeddings(),
  //   { pineconeIndex: index }
  // );


  // const results = await vectorStore.similaritySearch(title, 1, {

  // });

  // console.log({ results });

  // const context = "results[0].pageContent"
  const context = ""
  const topic = title

  const prompt = `Use the context below to write a 400 word blog post about the topic below:
    Context: ${context}
    Topic: ${topic}
    Blog post:`

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };


  const stream = await OpenAIStream(payload);
  return new Response(stream);
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
