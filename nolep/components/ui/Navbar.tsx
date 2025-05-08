"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <SignedIn>
      <nav className="relative flex items-center justify-between p-4 shadow-md bg-yellow-500">
        {/* Layer Background dengan efek Multiply */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-100 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/bg1.png'), url('/images/bg2.png')",
          }}
        ></div>

        {/* Wrapper biar teks gak ketutup */}
        <div className="relative flex w-full justify-between items-center z-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Nolep Logo"
              width={40}
              height={40}
            />
            <span className="font-bold text-lg">Nolep</span>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-6">
            <Link
              href="/home"
              className={`hover:underline text-black ${
                pathname === "/home" ? "underline font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/camera"
              className={`hover:underline text-black ${
                pathname === "/camera" ? "underline font-bold" : ""
              }`}
            >
              Camera
            </Link>
            <Link
              href="/maps"
              className={`hover:underline text-black ${
                pathname === "/components" ? "underline font-bold" : ""
              }`}
            >
              Gmaps
            </Link>

            {/* Avatar yang bisa diklik ke Edit Profile */}
          </div>
          <UserButton />
        </div>
      </nav>
    </SignedIn>
  );
};

export default Navbar;
