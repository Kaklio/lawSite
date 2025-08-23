import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Case from "@/models/Case";
import User from "@/models/User";
import File from "@/models/File";

export async function PUT(req, context) {
  const { params } = await context; // ✅ await context to get params
 
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
    const { fileId } = await req.json();
    const { id: caseId } = await params;

    // Verify the case belongs to the user
    const existingCase = await Case.findOne({ _id: caseId, userId: user._id });
    if (!existingCase) {
      return new Response(JSON.stringify({ error: "Case not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Verify the file belongs to the user
    const file = await File.findOne({ _id: fileId, userId: user._id });
    if (!file) {
      return new Response(JSON.stringify({ error: "File not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Add file to case if not already present
    if (!existingCase.files.includes(fileId)) {
      existingCase.files.push(fileId);
      await existingCase.save();
    }
    
const updatedCase = await Case.findOne({ _id: caseId, userId: user._id })
  .populate('files'); // <-- make sure this matches your schema's ref name

return new Response(JSON.stringify(updatedCase), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
  } catch (error) {
    console.error("Case update error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Add this DELETE handler to the existing file
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
    const caseId = params.id;
    
    // Verify the case belongs to the user
    const existingCase = await Case.findOne({ _id: caseId, userId: user._id });
    if (!existingCase) {
      return new Response(JSON.stringify({ error: "Case not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Delete the case (files remain in the system)
    await Case.deleteOne({ _id: caseId });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Case deletion error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Add this new handler for removing files from cases
export async function PATCH(req, { params }) {
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
    const { fileId } = await req.json();
    const caseId = params.id;
    
    // Verify the case belongs to the user
    const existingCase = await Case.findOne({ _id: caseId, userId: user._id });
    if (!existingCase) {
      return new Response(JSON.stringify({ error: "Case not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Remove file from case
    await Case.updateOne(
      { _id: caseId },
      { $pull: { files: fileId } }
    );
    
    // Get updated case
    const updatedCase = await Case.findOne({ _id: caseId }).populate('files');
    
    return new Response(JSON.stringify(updatedCase), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Case update error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}