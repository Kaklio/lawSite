import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import File from "@/models/File";
import User from "@/models/User";


export async function POST(req) {
  try {
    await connectDB();
      const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }


    const user = await User.findOne({ email: session.user.email });
    const { filename, filetype, size, content } = await req.json();

    // Decode Base64 back into a Buffer
    const buffer = Buffer.from(content, 'base64');



    const fileDoc = await File.create({
      userId: user._id,
      filename,
      filetype,
      size,
      content: buffer, // store as Buffer in MongoDB
    });

    return NextResponse.json({ success: true, file: fileDoc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}