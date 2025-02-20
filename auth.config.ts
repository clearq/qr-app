import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

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
  ],
};
