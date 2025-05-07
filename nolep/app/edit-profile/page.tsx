"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/ui/Navbar";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
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
              className="mt-3 bg-yellow-500 text-white py-2 px-5 rounded-lg text-lg cursor-pointer"
            >
              Choose Image
            </label>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="border w-full py-4 px-5 rounded-lg text-lg"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="border w-full py-4 px-5 rounded-lg text-lg"
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
              { label: "Password", name: "password", type: "password" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-lg font-semibold mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  className="border w-full py-4 px-5 rounded-lg text-lg"
                  value={formData[name as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [name]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                type="button"
                className="border border-yellow-500 text-yellow-500 px-10 py-3 rounded-lg text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-white px-10 py-3 rounded-lg text-lg"
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
