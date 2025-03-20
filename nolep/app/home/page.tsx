import Navbar from "@/components/ui/Navbar";

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className="p-6">
                <h1 className="text-2xl font-bold">Home</h1>
                <p>Selamat datang di beranda aplikasi Nolep!</p>
            </main>
        </div>
    );
}
