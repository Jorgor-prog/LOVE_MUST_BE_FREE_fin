import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"

async function main(){
  await prisma.user.upsert({
    where:{ loginId: ADMIN_LOGIN },
    update:{ loginPassword: ADMIN_PASSWORD, role:"ADMIN" },
    create:{
      role:"ADMIN",
      loginId: ADMIN_LOGIN,
      loginPassword: ADMIN_PASSWORD,
      adminNoteName:"Admin",
      profile:{ create:{} },
      codeConfig:{ create:{ lastStep:6 } }
    }
  })
}
main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1) })
