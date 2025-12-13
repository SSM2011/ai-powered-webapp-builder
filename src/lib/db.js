import {PrismaClient} from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const db = globalThis.prisma || new PrismaClient({
    adapter: adapter,
    log: ['query', 'info', 'warn', 'error'],
})

if(process.env.NODE_ENV === "development"){
    globalThis.prisma = db
}

export default db;