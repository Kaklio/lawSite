// app/api/chats/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

if (!session?.user) {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
  try {
    const user = await User.findOne({ email: session.user.email });

    const chats = await Chat.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .select("_id title messages createdAt updatedAt");

    return new Response(JSON.stringify(chats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch chats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
