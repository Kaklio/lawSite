// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");
        if (user.provider !== "credentials") throw new Error(`Try signing in with ${user.provider}`);
        
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return { 
          id: user._id.toString(), 
          username: user.username, 
          email: user.email,
          provider: user.provider 
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.split('@')[0] // Generate username from email
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      
      if (account.provider === "google") {
        const existingUser = await User.findOne({ 
          $or: [
            { email: user.email },
            { googleId: user.id }
          ]
        });

        if (!existingUser) {
          // Create new user
          const newUser = new User({
            email: user.email,
            username: user.username || profile.email.split('@')[0],
            provider: "google",
            googleId: user.id
          });
          await newUser.save();
        } else if (!existingUser.googleId) {
          // Merge accounts if email already exists
          existingUser.googleId = user.id;
          existingUser.provider = "google";
          await existingUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.provider = user.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.provider = token.provider;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };