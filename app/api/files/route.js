import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import File from "@/models/File";
import User from "@/models/User";

export async function GET() {
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
    const files = await File.find({ userId: user._id }).sort({ createdAt: -1 });
    
    return new Response(JSON.stringify(files), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("File fetch error:", error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}