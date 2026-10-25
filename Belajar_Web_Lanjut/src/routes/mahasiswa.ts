import { Elysia, t } from "elysia";

type Mahasiswa = {
  id: number;
  nama: string;
  email: string;
  jurusan: string;
};

const mahasiswa: Mahasiswa[] = [
  {
    id: 1,
    nama: "Ahmad",
    email: "ahmad@example.com",
    jurusan: "Teknik Informatika",
  },
  {
    id: 2,
    nama: "Anisa",
    email: "anisa@example.com",
    jurusan: "Manajemen Informatika",
  },
  {
    id: 3,
    nama: "Andika",
    email: "andika@example.com",
    jurusan: "Teknik Informatika",
  },
];

const mahasiswaBodySchema = t.Object({
  nama: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  jurusan: t.String({ minLength: 1 }),
});

export const mahasiswaRoute = new Elysia({ prefix: "/mahasiswa" })
  .get("/", () => mahasiswa)
  .head("/", () => mahasiswa)
  .options("/", ({ set }) => {
    set.status = 204;
    set.headers.allow = "GET, HEAD, POST, OPTIONS, TRACE";
    return null;
  })
  .get("/:id", ({ params, set }) => {
    const mahasiswaId = Number(params.id);

    if (!Number.isSafeInteger(mahasiswaId) || mahasiswaId < 1) {
      set.status = 400;
      return { error: "ID mahasiswa tidak valid" };
    }

    const data = mahasiswa.find((item) => item.id === mahasiswaId);

    if (!data) {
      set.status = 404;
      return { error: "Mahasiswa tidak ditemukan" };
    }

    return data;
  })
  .head("/:id", ({ params, set }) => {
    const mahasiswaId = Number(params.id);

    if (!Number.isSafeInteger(mahasiswaId) || mahasiswaId < 1) {
      set.status = 400;
      return { error: "ID mahasiswa tidak valid" };
    }

    const data = mahasiswa.find((item) => item.id === mahasiswaId);

    if (!data) {
      set.status = 404;
      return { error: "Mahasiswa tidak ditemukan" };
    }

    return data;
  })
  .options("/:id", ({ set }) => {
    set.status = 204;
    set.headers.allow = "GET, HEAD, PUT, PATCH, DELETE, OPTIONS, TRACE";
    return null;
  })
  .post(
    "/",
    ({ body, set }) => {
      const newItem: Mahasiswa = {
        id: mahasiswa.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1,
        nama: body.nama,
        email: body.email,
        jurusan: body.jurusan,
      };

      mahasiswa.push(newItem);
      set.status = 201;
      return newItem;
    },
    { body: mahasiswaBodySchema },
  )
  .route("TRACE", "/", ({ request }) => ({
    method: request.method,
    url: request.url,
  }))
  .route("TRACE", "/:id", ({ request, params }) => ({
    method: request.method,
    url: request.url,
    id: params.id,
  }))
  .connect("/", ({ set }) => {
    set.status = 501;
    return { error: "CONNECT tunnel tidak didukung oleh API ini" };
  })
  .connect("/:id", ({ set }) => {
    set.status = 501;
    return { error: "CONNECT tunnel tidak didukung oleh API ini" };
  })
  .put(
    "/:id",
    ({ params, body, set }) => {
      const mahasiswaId = Number(params.id);

      if (!Number.isSafeInteger(mahasiswaId) || mahasiswaId < 1) {
        set.status = 400;
        return { error: "ID mahasiswa tidak valid" };
      }

      const index = mahasiswa.findIndex((item) => item.id === mahasiswaId);

      if (index === -1) {
        set.status = 404;
        return { error: "Mahasiswa tidak ditemukan" };
      }

      mahasiswa[index] = { id: mahasiswaId, ...body };
      return mahasiswa[index];
    },
    { body: mahasiswaBodySchema },
  )
  .patch(
    "/:id",
    ({ params, body, set }) => {
      const mahasiswaId = Number(params.id);

      if (!Number.isSafeInteger(mahasiswaId) || mahasiswaId < 1) {
        set.status = 400;
        return { error: "ID mahasiswa tidak valid" };
      }

      const index = mahasiswa.findIndex((item) => item.id === mahasiswaId);

      if (index === -1) {
        set.status = 404;
        return { error: "Mahasiswa tidak ditemukan" };
      }

      mahasiswa[index] = { ...mahasiswa[index], ...body };
      return mahasiswa[index];
    },
    {
      body: t.Partial(mahasiswaBodySchema, { minProperties: 1 }),
    },
  )
  .delete("/:id", ({ params, set }) => {
    const mahasiswaId = Number(params.id);

    if (!Number.isSafeInteger(mahasiswaId) || mahasiswaId < 1) {
      set.status = 400;
      return { error: "ID mahasiswa tidak valid" };
    }

    const index = mahasiswa.findIndex((item) => item.id === mahasiswaId);

    if (index === -1) {
      set.status = 404;
      return { error: "Mahasiswa tidak ditemukan" };
    }

    const [deleted] = mahasiswa.splice(index, 1);
    return { message: "Mahasiswa berhasil dihapus", data: deleted };
  });
