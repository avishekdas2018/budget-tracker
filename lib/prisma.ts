/* eslint-disable no-var */

// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma



import { PrismaClient } from '@prisma/client';

// Add type declaration for globalThis in TypeScript
declare global {
  // Prevent variable redeclaration error in TypeScript
  var prisma: PrismaClient | undefined;
}

// Create a single Prisma Client instance
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma; // Ensure the client is reused in development
}

export default prisma;





