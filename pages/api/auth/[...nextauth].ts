import EmailProvider from "next-auth/providers/email";

import NextAuth from "next-auth"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
      EmailProvider({
         server: 'smtp://username:password@smtp.example.com:587',
         from: 'noreply@example.com'
       }),
    ],
    secret: process.env.SECRET,
    pages: {
       signIn: "/auth/signin",
    },
    
 });