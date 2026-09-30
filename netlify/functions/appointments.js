import { getStore } from "@netlify/blobs";
export default async (req) => {
  const { phone, pin } = await req.json();
  if (phone !== process.env.OWNER_PHONE || pin !== process.env.OWNER_PIN)
    return new Response("Unauthorized", { status: 401 });
  const store = getStore("appointments");
  const { blobs } = await store.list();
  const items = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: "json" }))
  );
  return Response.json(items);
};
