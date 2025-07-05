// app/api/chats/delete/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { chatIds } = await req.json();

  const user = await User.findOne({ email: session.user.email });
  await Chat.deleteMany({ _id: { $in: chatIds }, userId: user._id });

  return new Response(JSON.stringify({ success: true }));
}
