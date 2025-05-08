"use client";

import React, { useState } from "react";
import InputWithIcon from "../ui/InputWithIcon";
import Image from "next/image";
import ButtonWithText from "../ui/ButtonWithText";
import Link from "next/link";

export default function SigninForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("Form Data:", formData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen bg-[#FAEED3]">
      {/* Bagian Kiri (Ilustrasi & Pesan) */}
      <div className="flex flex-1 flex-col justify-between items-center bg-[#FAEED3] p-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FAEED3] rounded-br-[100px]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-left text-3xl font-bold text-black">
            Feeling drowsy while driving?
          </h1>
          <h2 className="text-left text-3xl font-semibold text-black mt-3">
            <span className="text-red-600">Don’t</span> take the risk!
          </h2>
          <Image
            src="/images/drowsy-driver.png"
            alt="Drowsy Illustration"
            width={350}
            height={350}
            className=" w-full object-contain mt-6 mb-0"
          />
        </div>
      </div>

      {/* Bagian Kanan (Form Login) */}
      <div className="w-full md:w-1/2 flex flex-col rounded-l-4xl justify-center items-center bg-[var(--yellow)] p-10">
        <div className="w-full max-w-md">
          <h2 className="text-[55px] font-bold text-left text-black drop-shadow-lg">
            Welcome Back
          </h2>
          <p className="text-[18px] font-medium text-black text-left mt-1 mb-3">
            Sign in to continue using Nolep
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <InputWithIcon
              iconSrc="/images/username.png"
              altText="User Icon"
              type="text"
              placeholder="Username"
              value={formData.username}
              name="username"
              onChangeFunc={handleChange}
            />

            {/* Email */}
            <InputWithIcon
              iconSrc="/images/email.png"
              altText="Email Icon"
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChangeFunc={handleChange}
            />

            {/* Password */}
            <InputWithIcon
              iconSrc="/images/password.png"
              altText="Password Icon"
              type="password"
              placeholder="Password"
              value={formData.password}
              name="password"
              onChangeFunc={handleChange}
            />

            {/* Tombol Login */}
            <ButtonWithText
              text={isLoading ? "Loading..." : "Login"}
              onClick={handleSubmit}
            />
          </form>

          {/* Link ke Signup */}
          <p className="text-center text-black 0 mt-8">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-black font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
