import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import File from "@/models/File";
import User from "@/models/User";
import Case from "@/models/Case";

export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    const fileId = params.id;
    
    // Verify the file belongs to the user
    const file = await File.findOne({ _id: fileId, userId: user._id });
    if (!file) {
      return new Response(JSON.stringify({ error: "File not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Remove file from any cases that reference it
    await Case.updateMany(
      { userId: user._id, files: fileId },
      { $pull: { files: fileId } }
    );

    // Delete the file
    await File.deleteOne({ _id: fileId });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("File deletion error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}