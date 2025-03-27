import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const codeStorage = new Map(); // Temporary storage (use Redis/DB in production)

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (code) {
      // ✅ Step 2: Handle verification request
      const storedCode = codeStorage.get(email);
      if (storedCode === code) {
        codeStorage.delete(email); // Remove after verification
        return NextResponse.json({ success: true, message: "Code verified!" });
      } else {
        return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
      }
    } else if (email) {
      // ✅ Step 1: Generate and send code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      codeStorage.set(email, generatedCode);
     
          // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Sentinal Associates" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${generatedCode}`,
    });


      return NextResponse.json({ success: true, message: "Code sent" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
