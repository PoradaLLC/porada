import { NextResponse } from "next/server";

const MSHOTS_PLACEHOLDER_MAX_BYTES = 5_000;
const BUCKET = "screenshots";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const cacheKey = `${hostname}.png`;
  const mshotsUrl = `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.redirect(mshotsUrl, 302);
  }

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  // Check cache
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { search: cacheKey });
  const isCached = !listError && files?.some((f) => f.name === cacheKey);

  if (isCached) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(cacheKey);
    return Response.redirect(data.publicUrl, 302);
  }

  // Fetch from mshots
  let res: globalThis.Response;
  try {
    res = await fetch(mshotsUrl, { next: { revalidate: 0 } });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
  if (!res.ok) return new NextResponse(null, { status: 502 });

  const buffer = await res.arrayBuffer();

  // Placeholder detection: mshots returns a tiny gray image while still processing
  if (buffer.byteLength < MSHOTS_PLACEHOLDER_MAX_BYTES) {
    return Response.redirect(mshotsUrl, 302);
  }

  // Upload to Supabase Storage
  const contentType = res.headers.get("content-type") ?? "image/png";
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(cacheKey, buffer, { contentType, upsert: true });

  if (uploadError) return Response.redirect(mshotsUrl, 302);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(cacheKey);
  return Response.redirect(data.publicUrl, 302);
}
