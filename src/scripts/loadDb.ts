import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import OpenAI from "openai";
import "dotenv/config";




type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const {OPEN_AI_API_KEY,ASTRA_DB_NAMESPACE,ASTRA_DB_COLLECTION,ASTRA_DB_API_ENDPOINT,ASTRA_DB_APPLICATION_TOKEN} = process.env

const openai = new OpenAI({apiKey: OPEN_AI_API_KEY})

const Data = [
   
    "https://www.who.int/health-topics",
    "https://www.cdc.gov/health-topics.html",
    "https://www.medrxiv.org/content/early/recent",
    "https://arxiv.org/list/cs.AI/recent"

   
]

// PubMed Search
// async function searchPubMed(query: string) {
//   const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
//     query
//   )}&retmode=json&retmax=5`;

//   const res = await fetch(url, {
//     headers: {
//       "User-Agent": "myapp/1.0 (ndungudavidmuchoki@gmail.com)",
//     },
//   });

//   if (!res.ok) throw new Error(`PubMed error: ${res.status}`);
//   const data = await res.json();
//   return data.esearchresult.idlist; // Array of PubMed IDs
// }


// // PubMed Fetch (article details, returns XML)
// async function fetchDetails(ids: string[]) {
//   const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(
//     ","
//   )}&retmode=xml`;

//   const res = await fetch(url, {
//     headers: {
//       "User-Agent": "myapp/1.0 (your_email@example.com)",
//     },
//   });

//   if (!res.ok) throw new Error(`PubMed fetch error: ${res.status}`);
//   return await res.text(); // you can parse XML later
// }

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT || "", {namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter(
{
    chunkSize: 512,
    chunkOverlap: 100

})

const createCollection = async (similarityMetric: SimilarityMetric ="dot_product") => {
    const res  = await db.createCollection(ASTRA_DB_COLLECTION!, {
        vector:{
            dimension: 1536, //5
            metric: similarityMetric
        }
    })
    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION || "")
    for await (const url of Data) {
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })
            const vector = embedding.data[0].embedding
            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })
            console.log(res)
        }
    }
}
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
                headless: true
            },
            gotoOptions: {
                waitUntil: "domcontentloaded"
            },
            evaluate: async (page, browser) => {
                const result = await page.evaluate(() => document.body.innerHTML)
                await browser.close()
                return result
            
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')

}

createCollection().then(()=> loadSampleData())
