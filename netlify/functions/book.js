import { getStore } from "@netlify/blobs";
export default async (req) => {
  const { name, phone, date, time } = await req.json();
  if (!name || !phone || !date || !time)
    return new Response("Missing fields", { status: 400 });
  const store = getStore("appointments");
  const id = Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  await store.setJSON(id, { id, name, phone, date, time });
  return Response.json({ ok: true });
};
