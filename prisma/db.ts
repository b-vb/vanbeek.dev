import { Prisma, PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export type UserWithMeasurements = Prisma.UserGetPayload<{
  include: {
    measurements: true;
  };
}>;

export type MeasurementWithAuthor = Prisma.MeasurementGetPayload<{
  include: {
    author: true
  }
}>;
