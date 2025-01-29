import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
// import AppleProvider from "@auth/core/providers/apple";
// import GoogleProvider from "@auth/core/providers/google";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials: any) {
        try {
          const customer = await prisma.customer.findUnique({
            where: { email: credentials.email },
          });
          if (customer && customer.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              customer.password
            );
            if (isPasswordCorrect) {
              // Convert user.id to string if needed
              const customerId: string = customer.id.toString();
              return {
                ...customer,
                id: customerId,
              };
            }
          }
        } catch (err) {
          throw new Error(
            err instanceof Error ? err.message : "An error occurred"
          );
        }
        return null;
      },
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // Add Timeer and Staffin providers here if they have OAuth support
  ],
};
