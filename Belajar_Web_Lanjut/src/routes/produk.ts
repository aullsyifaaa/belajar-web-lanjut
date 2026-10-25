import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { productsTable } from "../db/schema";

const produkBodySchema = t.Object({
  namaBarang: t.String({ minLength: 1 }),
  stok: t.Optional(t.Integer({ minimum: 0 })),
  harga: t.Integer({ minimum: 0 }),
});

const produkPutSchema = t.Object({
  namaBarang: t.String({ minLength: 1 }),
  stok: t.Integer({ minimum: 0 }),
  harga: t.Integer({ minimum: 0 }),
});

const produkPatchSchema = t.Partial(produkBodySchema, { minProperties: 1 });

function parseProdukId(id: string): number | null {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export const produkRoute = new Elysia({ prefix: "/produk" })
  .get("/", async () => db.select().from(productsTable))
  .get("/:id", async ({ params, set }) => {
    const id = parseProdukId(params.id);

    if (id === null) {
      set.status = 400;
      return { error: "ID produk tidak valid" };
    }

    const [produk] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!produk) {
      set.status = 404;
      return { error: "Produk tidak ditemukan" };
    }

    return produk;
  })
  .post(
    "/",
    async ({ body, set }) => {
      const [produk] = await db
        .insert(productsTable)
        .values(body)
        .returning();

      set.status = 201;
      return produk;
    },
    { body: produkBodySchema },
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
      const id = parseProdukId(params.id);

      if (id === null) {
        set.status = 400;
        return { error: "ID produk tidak valid" };
      }

      const [produk] = await db
        .update(productsTable)
        .set(body)
        .where(eq(productsTable.id, id))
        .returning();

      if (!produk) {
        set.status = 404;
        return { error: "Produk tidak ditemukan" };
      }

      return produk;
    },
    { body: produkPutSchema },
  )
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      const id = parseProdukId(params.id);

      if (id === null) {
        set.status = 400;
        return { error: "ID produk tidak valid" };
      }

      const [produk] = await db
        .update(productsTable)
        .set(body)
        .where(eq(productsTable.id, id))
        .returning();

      if (!produk) {
        set.status = 404;
        return { error: "Produk tidak ditemukan" };
      }

      return produk;
    },
    { body: produkPatchSchema },
  )
  .delete("/:id", async ({ params, set }) => {
    const id = parseProdukId(params.id);

    if (id === null) {
      set.status = 400;
      return { error: "ID produk tidak valid" };
    }

    const [produk] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (!produk) {
      set.status = 404;
      return { error: "Produk tidak ditemukan" };
    }

    return { message: "Produk berhasil dihapus", data: produk };
  });
