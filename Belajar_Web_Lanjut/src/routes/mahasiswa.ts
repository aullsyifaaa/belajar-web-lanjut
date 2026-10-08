import { Elysia } from "elysia";

const mahasiswa = [
    {
        id: 1,
        nama: "Ahmad",
        email: "ahmad@example.com",
        jurusan: "Teknik Informatika"
    },
    {
        id: 2,
        nama: "Anisa",
        email: "anisa@example.com",
        jurusan: "Manajemen Informatika"
    },
    {
        id: 3,
        nama: "Andika",
        email: "andika@example.com",
        jurusan: "Teknik Informatika"
    }
];

export const mahasiswaRoute = new Elysia({
    prefix: "/mahasiswa"
});

mahasiswaRoute.get("/:id", ({ params }) => {
    const mahasiswaId = params.id;
    const data = mahasiswa.find(m => m.id === parseInt(mahasiswaId));
    if (data) {
        return data;
    } else {
        return { error: "Mahasiswa tidak ditemukan" };
    }
});

mahasiswaRoute.post("/", ({ params, body }) => {
    if (body) {
        return body;
    } else {
        return { error: "Tidak ada data yang masuk" };
    }
});

// tambahkan PUT, PATCH, DELETE, CONNECT