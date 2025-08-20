import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const me = await getSession();
  if(!me?.user) return NextResponse.json({ ok:true });
  return NextResponse.json({ ok:true });
}
