import React from "react";

interface ButtonWithTextProps {
    text: string;
    onClick: () => void;
}

const ButtonWithText: React.FC<ButtonWithTextProps> = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full h-[45px] bg-black text-white text-[25px] font-semibold rounded-[25px] shadow-lg transition duration-300 hover:bg-gray-800 hover:shadow-xl mt-5"
        >
            {text}
        </button>
    );
};

export default ButtonWithText;
