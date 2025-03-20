import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
    return (
        <nav className="relative flex items-center justify-between p-4 shadow-md bg-yellow-500">
            {/* Layer Background dengan efek Multiply */}
            <div
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-100 z-0 pointer-events-none"
                style={{ backgroundImage: "url('/images/bg1.png'), url('/images/bg2.png')" }}
            ></div>

            {/* Wrapper biar teks gak ketutup */}
            <div className="relative flex w-full justify-between items-center z-10">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Image src="/images/logo.png" alt="Nolep Logo" width={40} height={40} />
                    <span className="font-bold text-lg">Nolep</span>
                </div>

                {/* Menu */}
                <div className="flex items-center gap-6">
                    <Link href="/home" className="hover:underline text-black">
                        Beranda
                    </Link>
                    <Link href="/camera" className="hover:underline text-black">
                        Camera
                    </Link>
                    <Link href="/maps" className="hover:underline text-black">
                        Gmaps
                    </Link>

                    {/* Avatar yang bisa diklik ke Edit Profile */}
                    <Link href="/edit-profile">
                        <Image
                            src="/images/pp.jpg"
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10 object-cover border-2 border-white cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
