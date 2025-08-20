import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const s = await getSession();
  if(!s?.user) return NextResponse.json({ ok:false }, { status:401 });
  const cfg = await prisma.codeConfig.findUnique({ where:{ userId: s.user.id } });
  return NextResponse.json({
    ok:true,
    config:{
      lastStep: cfg?.lastStep ?? 1,
      paused: cfg?.paused ?? false,
      currentText: cfg?.codeText ? (cfg.codeText.slice(0, cfg.offset || 0).split('').join(' ')) : ''
    }
  });
}
