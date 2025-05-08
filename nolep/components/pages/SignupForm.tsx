
import React, { useState } from "react";
import InputWithIcon from "../ui/InputWithIcon";
import Image from "next/image";
import ButtonWithText from "../ui/ButtonWithText";
import Link from "next/link";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi sederhana
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            alert("Please fill all fields!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
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
                {/* Background Layer */}
                <div
                    className="absolute top-0 left-0 w-full h-full mix-blend-multiply opacity-100 bg-center"
                    style={{ backgroundImage: 'url("/images/background.png")', zIndex: 0 }}
                ></div>

                {/* Overlay untuk efek lebih smooth */}
                <div className="absolute top-0 left-0 w-full h-full bg-[#FAEED3] opacity-50 z-10"></div>

                {/* Konten utama */}
                <div className="relative z-20 text-center">
                    <h1 className="text-4xl font-bold text-black text-center font-roboto">
                        Your safety starts <br />{" "}
                        <span className="text-yellow-600">with awareness</span>
                    </h1>
                    <p className="text-center text-black mt-4">
                        Nolep tracks microsleep in real-time to help you <br />stay focused and secure.
                    </p>
                    <Image
                        src="/images/driver.png"
                        alt="Driver Illustration"
                        width={1000}
                        height={1000}
                        className="w-full object-contain mt-6 mb-0 relative z-20"
                    />
                </div>
            </div>


            {/* Bagian Kanan (Form Signup) */}
            <div className="w-full md:w-1/2 flex flex-col rounded-l-4xl justify-center items-center bg-[var(--yellow)] p-10">
                <div className="w-full max-w-md">
                    <h2 className="text-[50px] font-bold text-left text-black drop-shadow-lg">
                        Create Account
                    </h2>
                   

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

                        {/* Confirm Password */}
                        <InputWithIcon
                            iconSrc="/images/password.png"
                            altText="Password Icon"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            name="confirmPassword"
                            onChangeFunc={handleChange}
                        />

                        {/* Tombol Signup */}
                        <ButtonWithText text={isLoading ? "Loading..." : "Create"} onClick={handleSubmit} />
                    </form>

                    {/* Link ke Login */}
                    <p className="text-center text-black mt-8">
                        Already have an account?{" "}
                        <Link href="/" className="text-black font-semibold underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
