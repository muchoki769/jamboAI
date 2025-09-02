import OpenAI from "openai";
import {OpenAIStream,StreamingTextResponse } from "ai";
// import type { ChatCompletionChunk } from "openai/resources/chat/completions";
// import type { ChatCompletionChunk } from "openai/resources/chat";
// import OpenAI, { ChatCompletionChunk } from "openai";
// import { Stream } from "openai/streaming";
// import { ChatCompletionChunk } from "openai"



import { DataAPIClient } from "@datastax/astra-db-ts";

const {OPEN_AI_API_KEY,
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN
} = process.env

const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT || "", {namespace: ASTRA_DB_NAMESPACE})

export async function POST(req:Request) {
  try {
    const {messages} = await req.json()
    const latestMessage = messages[messages?.length - 1]?.content

    let docContext = ""

   const embedding =  await openai.embeddings.create ({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float"
    })

    try {
        const collection  = await db.collection(ASTRA_DB_COLLECTION || "")
        const cursor = collection.find({}, {
            sort: {
                $vector: embedding.data[0].embedding,

            },
            limit: 10
        })

        const documents = await cursor.toArray()

        const docsMap = documents?.map(doc => doc.text)

        docContext = JSON.stringify(docsMap)
    } catch (e) {
     console.log("Error querying db:", e);
     docContext = ""
   }
        const template ={
            role: "system",
            content: `You are an AI assistant who knows everything about Health.
            Use the below context to augment what you know about Health.
            The context will provide you with the most recent page data from wikipedia,
            the official Health website and others.
            If the context doesnt include the information you need answer based on your
            existing knowledge and dont mention the source your information or what the context does or doesnt include.
            Format responses using markdown where applicable and dont return images

            -----------

            START CONTEXT
            ${docContext}
            END CONTEXT
            ------------
            QUESTION: ${latestMessage}
            -----------
            `
        }
        const response = await openai.chat.completions.create ({
            model: "gpt-4",
            stream: true,
            messages:[template, ...messages]
        })
        const stream = OpenAIStream(response as any)
        return new StreamingTextResponse(stream)
        
  } catch(err) {
    throw err
  }
}