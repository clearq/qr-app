import { prisma } from "@/lib/db";


export const getUserById = async (id : string) => {
    try {
        const user = await prisma.customer.findFirst({
            where: {id}
        });

        return user
    } catch {
        return null;
    }
}