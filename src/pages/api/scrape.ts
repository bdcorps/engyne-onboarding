// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import { load } from 'cheerio';
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
  const { url } = req.body

console.log({url})

  const { data } = await axios.get(url)
  const $ = load(data)

const bodyText:any = []
let result:string = ""
const t = $('body').find('h1,h2,h3,h4,h5,h6,p,a').text()
  
$($('body').find('h1,h2,h3,h4,h5,h6,p,a')).each(function(index, element) {
 bodyText.push($(element).text())
  });

  result = bodyText.join('\n\n')

  const openAIResult = await getOpenAIAnswer(result.substring(0, 1000))

  res.status(200).json({data:openAIResult})
  
}

export const getOpenAIAnswer = async (context:string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [{
      role: "system", content: "You are a senior marketing expert at a SaaS company. Only respond in JSON format.",
    }, {
      role: "user", content: `This is the copy of a landing page for a product: ${context}. Write a short description of the product and the target audience in the space below.

    Provide a RFC8259 compliant JSON response following this format without deviation.
    {"product": "product description", "target_audience": "target audience of the product: ${context}"}`}],
  });

  const result = completion.data.choices[0].message?.content || "No results"

console.log({result})

  try {
    const parsedResult: any = JSON.parse(result)

    console.log({parsedResult})
    return parsedResult
  } catch (error) {
    console.log({error})
    return result
  }
}
