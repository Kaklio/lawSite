// app/api/ask/route.js
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PromptTemplate } from "@langchain/core/prompts";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import fs from 'fs';
import Chat from "@/models/Chat";
import User from "@/models/User";
import path from 'path';
import { head } from '@vercel/blob';

export const maxDuration = 60; // 60 seconds


let vectorStorePromise = null;
let groq;
let vectorStore;

async function loadVectorStore() {
  if (vectorStorePromise) return vectorStorePromise;

  vectorStorePromise = (async () => {
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "BAAI/bge-base-en-v1.5",
    });

    if (process.env.VERCEL) {
      const tmpDir = "/tmp/legal_vector_store";
      fs.mkdirSync(tmpDir, { recursive: true });

      const files = ["faiss.index", "docstore.json"];
      for (const file of files) {
        const meta = await head(`legal_vector_store/${file}`, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        const res = await fetch(meta.downloadUrl);
        const data = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(tmpDir, file), data);
      }

      console.log("Vector store downloaded into /tmp");
      return FaissStore.load(tmpDir, embeddings);
    } else {
      return FaissStore.load(path.resolve("./legal_vector_store"), embeddings);
    }
  })();

    if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return vectorStorePromise;
}


async function initializeClients() {
    if (!vectorStore) {
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "BAAI/bge-base-en-v1.5",
    });

    const testEmbedding = await embeddings.embedQuery("test");
    console.log("Embedding dimension:", testEmbedding.length);

    if (process.env.VERCEL) {
      // ✅ Running on Vercel → fetch from Blob storage into /tmp
      const tmpDir = "/tmp/legal_vector_store";
      fs.mkdirSync(tmpDir, { recursive: true });

      const files = ["faiss.index", "docstore.json"];
      for (const file of files) {
        const meta = await head(`legal_vector_store/${file}`, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        const res = await fetch(meta.downloadUrl);
        const data = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(tmpDir, file), data);
      }

      vectorStore = await FaissStore.load(tmpDir, embeddings);
      console.log("✅ Vector store loaded from Vercel Blob");
    } else {
      // ✅ Running locally → load from local folder
      vectorStore = await FaissStore.load(
        path.resolve("./legal_vector_store"),
        embeddings
      );
      console.log("✅ Vector store loaded from local folder");
    }

    console.log("Index dimensions:", vectorStore.index.getDimension());
  }

  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
}

const promptTemplate = new PromptTemplate({
  template: `
  You are a Pakistani legal and constitutional expert. Answer strictly based on the given context which contains:
  - Constitution of Pakistan 1973
  - Penal codes
  - Civil codes
  - All laws, bills and Acts passed by the Parliament of Pakistan
  - British era laws still applicable in Pakistan

  For your answers:
  - Cite Article/Section numbers
  - Mention amendments if applicable
  - Specify punishments where relevant
  - If the question is not related to Pakistani law, state or constitution that is not answerable from the context, 
    respond with: "It is beyond my scope I only answer Pakistani legal questions"

  Context: {context}
  
  Question: {question}
  
  Authoritative Answer:`,
  inputVariables: ["context", "question"]
});

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  try {
    const { question, chatId } = await req.json();
    let user = null;
if (session?.user?.email) {
  user = await User.findOne({ email: session.user.email });
}

    // await initializeClients();

    // 🔑 cached, no re-download per request
    const vectorStore = await loadVectorStore();


    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n---\n\n");

    const formattedPrompt = await promptTemplate.format({ context, question });

    const completion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [{ role: "user", content: formattedPrompt }],
      temperature: 0.1,
    });

    const answer = completion.choices[0]?.message?.content;

let chatIdToReturn = null;

if (user) {
  let chat;

  if (chatId) {
    chat = await Chat.findById(chatId);
  } else {
    chat = await Chat.create({
      userId: user._id,
      messages: [],
      title: question.slice(0, 50) || "Untitled",
    });
  }

  chat.messages.push({ role: "user", content: question });
  chat.messages.push({ role: "ai", content: answer });
  await chat.save();

  chatIdToReturn = chat._id;
}

    return new Response(JSON.stringify({
      answer,
      sources: relevantDocs.map(doc => ({
        content: doc.pageContent.slice(0, 200) + "...",
        metadata: doc.metadata,
      })),
      chatId: chatIdToReturn,
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
