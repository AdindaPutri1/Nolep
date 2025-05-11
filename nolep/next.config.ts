import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Hanya menjalankan ESLint pada direktori tertentu selama build
    dirs: [
      "app",
      "pages",
      "components",
      "lib",
      "utils",
      "src",
      // Tambahkan direktori lain yang ingin di-lint
    ],
    // Mengabaikan direktori tertentu (tidak tersedia langsung dalam konfigurasi)
    // Sebagai alternatif, gunakan .eslintignore atau ignoreDuringBuilds

    // Atau menonaktifkan pemeriksaan ESLint selama build jika diperlukan
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
