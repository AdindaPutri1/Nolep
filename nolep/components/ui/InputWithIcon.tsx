import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputWithIconProps {
  iconSrc: string;
  altText: string;
  type: string;
  placeholder: string;
  value: string;
  name: string;
  onChangeFunc: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconSize?: number;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  iconSrc,
  altText,
  type,
  placeholder,
  value,
  name,
  onChangeFunc,
  iconSize = 25,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center w-full mt-3">
      {/* Icon di luar input */}
      <img src={iconSrc} alt={altText} className="w-7 h-7 mr-3" />

      {/* Input field */}
      <div className="relative w-full">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChangeFunc}
          className="w-full h-12 px-4 border-[3px] border-black rounded-2xl bg-transparent text-black placeholder-gray-500 focus:outline-none"
          required
        />

        {/* Tombol toggle password */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {!showPassword ? (
              <EyeOff size={iconSize} stroke="black" />
            ) : (
              <Eye size={iconSize} stroke="black" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputWithIcon;
