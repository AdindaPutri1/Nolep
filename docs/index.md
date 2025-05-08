# Nolep: Microsleep Detector for Drivers

## 1. Nama Kelompok
zzz turu - Kelompok 7 Senior Project TI

## 2. Anggota dan NIM Kelompok
- Faundra Pratama Sukma (22/505520/TK/55323)
- Adinda Putri Romadhon (22/505508/TK/55321)
- Aisa Selvira Quraata A’yunni (22/498561/Tk/54690)

## 3. Project Senior Project TI
Aplikasi **Nolep** dikembangkan dalam rangka Senior Project TI untuk meningkatkan keselamatan berkendara melalui deteksi microsleep berbasis image processing.

## 4. Instansi
Departemen Teknologi Elektro dan Teknologi Informasi, Fakultas Teknik, Universitas Gadjah Mada

### **a. Nama Produk**
**Nolep** - Microsleep Detector for Drivers

### **b. Jenis Produk**
Aplikasi berbasis **web** dengan implementasi **image processing** untuk mendeteksi microsleep dan memberikan informasi rest area terdekat.

### **c. Latar Belakang & Permasalahan**
Peningkatan jumlah kendaraan bermotor di Indonesia berbanding lurus dengan tingginya angka kecelakaan lalu lintas. Dari Januari hingga Agustus 2024, Korlantas Polri menangani 79.220 kecelakaan lalu lintas, dengan angka kecelakaan tertinggi pada April 2024, yaitu 11.924 kejadian. Adapun jumlah kendaraan yang terlibat kecelakaan lalu lintas sebanyak 722.470 unit. Hal ini menunjukkan adanya kebutuhan mendesak untuk meningkatkan upaya keselamatan berkendara di jalan raya. Rasa kantuk yang dialami pengemudi merupakan salah satu faktor utama penyebab kecelakaan lalu lintas. Sekitar 32% pengemudi mengaku pernah mengemudi dalam keadaan mengantuk setidaknya sekali dalam sebulan, dan 25% kecelakaan disebabkan oleh kondisi ini. Data Universitas X menunjukkan bahwa 95,5% kecelakaan terjadi akibat kelengahan, dengan 71,8% di antaranya disebabkan oleh kelelahan dan kantuk. Kondisi ini diperburuk oleh faktor eksternal seperti kecepatan kendaraan di atas 40 km/jam dan kondisi jalan yang menikung atau tidak rata. 
Penelitian terbaru menunjukkan bahwa teknologi deteksi kantuk berbasis kecerdasan buatan (AI) dengan memanfaatkan webcam, mampu mendeteksi gejala kantuk pada pengemudi. Teknologi deteksi kantuk berbasis kecerdasan buatan ini menggunakan algoritma, artificial intellegence, dan face recognition. Hal ini bertujuan untuk mendeteksi tanda kantuk pengemudi secara real-time. Sistem tersebut menggunakan kamera di area speedometer untuk menganalisis wajah pengemudi dan memberikan peringatan dini jika gejala kantuk terdeteksi. Teknologi ini dapat membantu mengurangi kecelakaan yang disebabkan oleh kelelahan dan kelengahan pengemudi.
Terdapat 49,52% dari 143 juta pengguna internet di Indonesia berasal dari kelompok usia 19-34 tahun. Dengan demikian, segmen ini menjadi target yang ideal untuk aplikasi deteksi kantuk yang berbasis aplikasi web. Kelompok usia 19-34 tahun adalah kelompok yang aktif mengakses teknologi baru dan lebih mudah beradaptasi dengan solusi digital yang menjadikannya pasar yang sangat potensial untuk meningkatkan keselamatan berkendara dengan aplikasi AI yang inovatif.

### **d. Ide Solusi**
Pemanfaatan teknologi AI dalam pencegahan terjadinya kecelakaan, salah satunya dengan menerapkan face recognition untuk mendeteksi kantuk pengemudi. Aplikasi ini memberikan rekomendasi dan peringatan kepada pengemudi apabila terdeteksi adanya indikasi kantuk. Dengan adanya aplikasi ini diharapkan dapat mengurangi angka kecelakaan lalu lintas karena faktor manusia yang saat ini di angka 61% berdasarkan artikel Good Stats yang berlandaskan data dari Korlantas Polri.

Kami mengembangkan **Nolep**, sebuah aplikasi berbasis AI yang dapat:
1. **Mendeteksi kantuk** menggunakan teknologi face recognition.
2. **Memberikan peringatan suara** jika terdeteksi tanda-tanda kantuk.
3. **Menampilkan lokasi rest area terdekat** untuk rekomendasi istirahat.
4. **Menyediakan log aktivitas** yang menampilkan riwayat kantuk pengguna.

### **e. Rancangan Fitur Solusi**

| **Fitur**               | **Keterangan** |
|-----------------|----------------------------------------------------------------|
| **Face Recognition**    | Mendeteksi indikasi kantuk berdasarkan ekspresi wajah pengemudi. |
| **Output Suara**        | Memberikan feedback atau peringatan melalui suara. |
| **Maps (Opsional)**     | Memberikan rekomendasi tempat istirahat terdekat. |
| **Log Aktivitas & Laporan Harian** | Menampilkan riwayat kantuk atau kelelahan pengguna. |

### **f. Analisis Kompetitor** 

#### **Kompetitor 1: Anti Sleep Pilot**  
- **Nama**: Anti Sleep Pilot
- **Jenis Kompetitor**: Indirect Competitor
- **Jenis Produk**: Hardware Service
- **Target Customer**: Pengemudi


| **Kelebihan**            | **Kekurangan** |  
|--------------------------|---------------|  
| Mudah di-setting         | Berbayar      |  
| Portable                 |               |  
| Akurasi tinggi (26 variabel) |               |  

**Key Competitive Advantage & Unique Value**  
- Akurasi tinggi dengan 26 variabel pengukuran  
- Desain portabel dan mudah digunakan  

---

#### **Kompetitor 2: Awake**  
- **Nama**: Awake  
- **Jenis Kompetitor**: Direct Competitor  
- **Jenis Produk**: Software Mobile  
- **Target Customer**: Pengemudi  


| **Kelebihan**            | **Kekurangan** |  
|--------------------------|---------------|  
| Gratis                   | Hanya mendeteksi mata |  
| Bisa diakses via handphone | Tidak dapat digunakan di perangkat lain |  
| Offline                  | Hanya tersedia di Android |  

**Key Competitive Advantage & Unique Value**  
- Aplikasi gratis dan dapat diakses secara offline  

---

#### **Kompetitor 3: Aware Driving**  
- **Nama**: Aware Driving  
- **Jenis Kompetitor**: Direct Competitor  
- **Jenis Produk**: Software Service  
- **Target Customer**: Pengemudi  


| **Kelebihan**            | **Kekurangan** |  
|--------------------------|---------------|  
| Terdapat track statistik | Hanya mendeteksi mata |  
| Portable karena mobile   | Hanya tersedia di Android |  
| Offline & Gratis         |               |  

**Key Competitive Advantage & Unique Value**  
- Fitur track statistik pengguna  
- Gratis dan bisa diakses secara offline 
