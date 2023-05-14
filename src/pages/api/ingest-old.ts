import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextApiRequest, NextApiResponse } from "next";

// Generate embeddings from OpenAI
// const generateEmbeddingsFromOpenAI = async (content:string) => {
//   // Create new OpenAI client
//   const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   // Generate embeddings from OpenAI
//   const openai = new OpenAIApi(configuration);
//   const apiResponse = await openai.createEmbedding({
//     model: "text-embedding-ada-002",
//     input: content,
//   });
//   const responseData = apiResponse?.data;
//   return responseData?.data[0].embedding;
// };

// Upsert OpenAI generated vectors into Pinecone
const upsertVectorsIntoPinecone = async (docs:any[]) => {
  const client = new PineconeClient();

  // Initialize the client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

const index = client.Index("devplan");
const res = await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex: index
});

  console.log({res})
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const docs = req.body.docs


  const documents =docs.map((doc:any) => {
  return  new Document({
      // metadata: { foo: "bar" },
      pageContent: doc.text,
    })

})


  const a = await upsertVectorsIntoPinecone(documents);


  


  // for (const doc of docs) {
  // const content = doc.text
  // const id = doc.id
  
  // console.log({content,id})
  
  // // const embedding = await generateEmbeddingsFromOpenAI(content);
  // const a = await upsertVectorsIntoPinecone({ });
  
  // console.log({a})
  
  // }
  
  
  
  res.status(200).json({data:"ok"})

// try {
//   // Get all documents from Mongodb db collection docs
//   const docs = await db.collection("docs").find({}).toArray();

//   // Loop through all docs and generate embeddings
//   for (const doc of docs) {
//     // Generate embedding from OpenAI
//     const embedding = await generateEmbeddingsFromOpenAI(doc.article);
//     if (!embedding) {
//       continue;
//     }

//     // Upsert embedding into pinecone
//     await upsertVectorsIntoPinecone({ id: doc.url, embedding, locale: "en" });

//     // Increase counts
//     totalUsage += vectorResponse.usage.total_tokens;
//     totalDocs++;
//     console.log(
//       `${totalDocs}/${docs.length} ${doc.url} inserted into Pinecone.`
//     );
//   }

//   console.log("Total tokens used: ", totalUsage);
//   console.log("Total cost: ", (totalUsage / 1000) * 0.0004);
// } catch (error) {
//   // console.log(error);
  
// }
// process.exit() 
// };




}


