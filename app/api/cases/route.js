import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
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
    const cases = await Case.find({ userId: user._id }).populate('files').sort({ createdAt: -1 });
    
    return new Response(JSON.stringify(cases), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Case fetch error:", error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Login Required To Create Case" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    const { title, type } = await req.json();
    
    const newCase = await Case.create({
      userId: user._id,
      title,
      type
    });
    
    return new Response(JSON.stringify(newCase), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Case creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}