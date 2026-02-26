import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const { tag } = await req.json()
    if (!tag) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
    }
    await revalidateTag(tag,"max")
    return NextResponse.json({ success: true, tag })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
