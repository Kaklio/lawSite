// app/api/ask/route.js

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PromptTemplate } from "@langchain/core/prompts";
import Groq from "groq-sdk";

let vectorStore;
let groq;

// Initialize clients (singleton pattern)
async function initializeClients() {
  if (!vectorStore) {
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "BAAI/bge-base-en-v1.5",
    });

    // Verify dimensionality
    const testEmbedding = await embeddings.embedQuery("test");
    console.log("Embedding dimension:", testEmbedding.length);

    vectorStore = await FaissStore.load(
      "./faiss_index",
      embeddings
    );
    console.log("Vector store loaded");
    console.log("Index dimensions:", vectorStore.index.getDimension());
  }

  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
}

// Create prompt template
const promptTemplate = new PromptTemplate({
  template: `
  You are a Pakistani legal expert. Answer strictly based on the given context which contains:
  - Constitution of Pakistan 1973
  - Penal codes
  - Civil codes
  - All laws, bills and Acts passed by the Parliament of Pakistan

  For your answers:
  - Cite Article/Section numbers
  - Mention amendments if applicable
  - Specify punishments where relevant
  - If the question is not related to Pakistani law or not answerable from the context, 
    respond with: "It is beyond my scope I only answer legal questions"

  Context: {context}
  
  Question: {question}
  
  Authoritative Answer:`,
  inputVariables: ["context", "question"]
});

// Main query function
async function queryRAG(question) {
  try {
    // Initialize clients if not already done
    await initializeClients();
    
    // Retrieve relevant documents
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    
    // Format context
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n---\n\n");
    const formattedPrompt = await promptTemplate.format({
      context: context,
      question: question
    });
    
    // Create and execute Groq completion
    const completion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [
        {
          role: "user",
          content: formattedPrompt
        }
      ],
      temperature: 0.1
    });
    const answer = completion.choices[0]?.message?.content;
    
    // Prepare sources
    const sources = relevantDocs.map(doc => ({
      content: doc.pageContent.slice(0, 200) + "...",
      metadata: doc.metadata
    }));
    
    return {
      answer,
      sources
    };
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { question } = body;

    console.log("Received question:", question);

    const results = await queryRAG(question);

    return new Response(JSON.stringify({ 
      answer: results.answer,
      sources: results.sources 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("🔥 RAG error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}