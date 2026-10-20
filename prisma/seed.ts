import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: "System",
    lastName: "Admin",
    email: "systemadmin@example.com",
    password: "$2a$12$KR5t/kTbHTeBmeis8m49ruXRE4HC0vfCCWWwMS4SsF.U5iNdM5ny2",
    role: "ADMIN",
    number: null,
    status: "ACTIVE",
    privilages : [],
  },
    
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();