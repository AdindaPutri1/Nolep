"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/ui/Navbar";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons from lucide-react

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState("/images/pp.jpg");
  const [showPassword, setShowPassword] = useState(false);
  const iconSize = 30; // Set the size for the eye icons

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "Apakah kamu sudah yakin untuk menyimpan data?"
    );
    if (isConfirmed) {
      console.log("Data disimpan:", formData);
    }
  };

  const handleCancel = () => {
    const isConfirmed = window.confirm("Kamu yakin untuk batalkan menyimpan?");
    if (isConfirmed) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        contactNumber: "",
        password: "",
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-6xl flex gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center w-1/4">
            <div className="relative w-32 h-32">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-gray-300 object-cover cursor-pointer"
                onClick={() =>
                  document.getElementById("profileImageInput")?.click()
                }
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profileImageInput"
            />
            <label
              htmlFor="profileImageInput"
              className="mt-3 bg-yellow-500 text-black shadow-md font-bold py-2 px-5 rounded-lg text-lg cursor-pointer hover:bg-yellow-600 transition-colors"
            >
              Choose Image
            </label>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold mb-1 cursor-text">
                  First Name
                </label>
                <input
                  type="text"
                  className="border w-full py-4 px-2 rounded-lg text-lg cursor-text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-base font-semibold mb-1 cursor-text">
                  Last Name
                </label>
                <input
                  type="text"
                  className="border w-full py-4 px-2 rounded-lg text-lg cursor-text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            {[
              { label: "Email", name: "email", type: "email" },
              { label: "Address", name: "address" },
              { label: "Contact Number", name: "contactNumber" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-base font-semibold mb-1 cursor-text">
                  {label}
                </label>
                <input
                  type={type}
                  className="border w-full py-4 px-2 rounded-lg text-lg cursor-text"
                  value={formData[name as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [name]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* Password Input with Eye/EyeOff Toggle */}
            <div>
              <label className="block text-base font-semibold mb-1 cursor-text">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="border w-full py-4 px-2 rounded-lg text-lg cursor-text pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {!showPassword ? (
                    <EyeOff size={iconSize} stroke="black" />
                  ) : (
                    <Eye size={iconSize} stroke="black" />
                  )}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="border border-yellow-500 text-yellow-500 px-10 py-3 rounded-lg text-lg shadow-md cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-black font-bold shadow-md px-10 py-3 rounded-lg text-lg cursor-pointer hover:bg-yellow-600 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
