// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

const {prompt} = req.body;

  const openAIResult = await getOpenAIAnswer(prompt)

  res.status(200).json({data:openAIResult})
}

const getOpenAIAnswer = async (context:string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [{
      role: "system", content: "You are an SEO marketing expert at a SaaS company.",
    }, {
      role: "user", content: context + ". Respond as an array."}],
  });

  const result = completion.data.choices[0].message?.content || "No results"


  try {
    const parsedResult: any = JSON.parse(result)
    return parsedResult
  } catch (error) {
    return result
  }
}
