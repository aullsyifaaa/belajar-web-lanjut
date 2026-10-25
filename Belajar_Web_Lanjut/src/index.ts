import { Elysia } from "elysia";
import { mahasiswaRoute } from "./routes/mahasiswa";
import { produkRoute } from "./routes/produk";

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT harus berupa bilangan bulat antara 1 dan 65535");
}

export const app = new Elysia()
  .use(mahasiswaRoute)
  .use(produkRoute);

app.listen(port);

console.log(`Server berjalan pada http://localhost:${port}`);
