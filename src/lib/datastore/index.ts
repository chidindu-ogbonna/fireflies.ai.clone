import { PrismaClient } from "@prisma/client";

// Attach the Prisma client to the global object in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// If an instance already exists in the global object, reuse it. Otherwise create a new one.
const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, assign the instance to the global variable to ensure a single instance
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
