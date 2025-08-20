import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const login = process.env.ADMIN_LOGIN || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin'
  const hash = await bcrypt.hash(password, 10)

  const existing = await prisma.user.findUnique({ where: { loginId: login } })
  if (!existing) {
    await prisma.user.create({
      data: { loginId: login, loginPassword: hash, role: 'ADMIN' }
    })
  }
}

main()
  .catch(() => {})
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
