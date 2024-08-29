import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const getUserId = async () => {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user.id
};