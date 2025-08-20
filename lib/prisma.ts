import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma__: PrismaClient | undefined
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma
}
