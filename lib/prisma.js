// This should be imported from lib/prisma.js
require('dotenv/config');
const { PrismaPg } = require('@prisma/adapter-pg');  // For other db adapters, see Prisma docs
const { PrismaClient } = require('../../generated/prisma/client.js');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };