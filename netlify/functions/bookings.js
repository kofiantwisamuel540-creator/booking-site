import { getStore } from "@netlify/blobs";

export const config = { path: "/api/bookings" };

const clean = (p) => String(p || "").replace(/\D/g, "");
const same = (a, b) => {
  a = clean(a); b = clean(b);
  return a.length >= 9 && b.length >= 9 && a.slice(-9) === b.slice(-9);
};

export default async (req) => {
  const store = getStore("appointments");

  if (req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    if (!b.name || !b.phone || !b.date || !b.time)
      return Response.json({ message: "Missing fields" }, { status: 400 });
    const id = String(b.id || Date.now()) + "-" + Math.random().toString(36).slice(2, 6);
    await store.setJSON(id, { ...b, id });
    return Response.json({ ok: true });
  }

  if (req.method === "GET") {
    const owner = new URL(req.url).searchParams.get("ownerPhone");
    if (!same(owner, process.env.OWNER_PHONE))
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    const { blobs } = await store.list();
    const bookings = await Promise.all(
      blobs.map((x) => store.get(x.key, { type: "json" }))
    );
    return Response.json({ bookings });
  }

  return new Response("Method not allowed", { status: 405 });
};
