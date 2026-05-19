# 🚀 Panduan Menjalankan Projek (Lab Test - Workout Tracker)
### BITP3123 Distributed Application Development

Repositori ini mengandungi projek penuh untuk **Lab Test (Distributed Application Development)** yang terdiri daripada dua bahagian utama:
1. **Backend (`workout-api`)** - Dibina menggunakan **Spring Boot (Java)**
2. **Frontend (`frontend`)** - Dibina menggunakan **Next.js (React / TypeScript / Tailwind CSS)**

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum anda mula, sila pastikan anda telah memasang perisian berikut pada komputer anda:

1. **Java Development Kit (JDK)**: Versi **17** atau ke atas.
2. **Node.js**: Versi **18** atau ke atas (bersama-sama dengan `npm`).
3. **IDE / Editor**: Visual Studio Code, IntelliJ IDEA, atau mana-mana editor kegemaran anda.

---

## 🖥️ 1. Cara Menjalankan Backend (Spring Boot)

Bahagian backend berfungsi sebagai API server untuk membekalkan data senaman (workout) kepada frontend.

### Langkah-langkah:

1. Buka terminal baru dan masuk ke direktori `workout-api`:
   ```bash
   cd workout-api
   ```

2. Jalankan arahan Maven untuk memulakan aplikasi Spring Boot:
   * **Untuk macOS/Linux:**
     ```bash
     chmod +x mvnw  # Berikan kebenaran akses (jika perlu)
     ./mvnw spring-boot:run
     ```
   * **Untuk Windows:**
     ```cmd
     mvnw.cmd spring-boot:run
     ```

3. Apabila selesai dimulakan, server backend akan berjalan pada port default:
   * 🔗 **URL:** `http://localhost:8080`

---

## 🌐 2. Cara Menjalankan Frontend (Next.js)

Bahagian frontend ialah aplikasi web moden yang akan berhubung dengan backend API untuk memaparkan maklumat senaman.

### Langkah-langkah:

1. Buka terminal baru (asing daripada terminal backend) dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Pasang semua dependency yang diperlukan:
   ```bash
   npm install
   ```

3. Jalankan server pembangunan (development server):
   ```bash
   npm run dev
   ```

4. Buka pelayar web (browser) anda dan layari alamat berikut:
   * 🔗 **URL:** `http://localhost:3000`

---

## 📁 Struktur Folder Utama

```text
Lab Test/
├── workout-api/        # Aplikasi Spring Boot (Java)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/   # Kod sumber Java (WorkoutApiApplication)
│   │   │   └── resources/ # Konfigurasi application.properties
│   └── pom.xml         # Dependency & tetapan Maven
├── frontend/           # Aplikasi Next.js (React/TS)
│   ├── app/            # Halaman dan komponen Next.js
│   ├── public/         # Fail statik (imej, dsb.)
│   └── package.json    # Dependency & skrip npm
└── README.md           # Panduan arahan ini (Fail ini)
```

---

## 💡 Nota Tambahan

* **Integrasi API**: Jika frontend perlu memanggil API daripada backend, pastikan URL panggilan ditujukan kepada `http://localhost:8080/api/...`.
* Pastikan kedua-dua **backend (workout-api)** dan **frontend** dijalankan secara serentak untuk memastikan sistem berfungsi sepenuhnya.
