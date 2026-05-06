import React from "react";

const techStack = [
    "WordPress",
    "HTML",
    "ReactJS",
    "NodeJS",
    "CSS",
    "Python",
    "Frappe",
    "ERPNext",
];

const MarqueeBanner = () => {
    const items = [...techStack, ...techStack];

    return (
        <div className="relative w-full overflow-hidden py-20 bg-transparent">

            {/* Keyframes (no config.js needed) */}
            <style>
                {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
            </style>

            {/* Black band */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[120%] h-[80px] flex items-center bg-[#1a1a1a] rotate-[2deg] z-[1]">
                <div
                    className="flex items-center whitespace-nowrap"
                    style={{ animation: "marquee 22s linear infinite reverse" }}
                >
                    {items.map((item, i) => (
                        <React.Fragment key={`black-${i}`}>
                            <span className="text-white font-black text-[2.2rem] px-5">
                                {item}
                            </span>
                            <span className="text-white text-[1.3rem] mx-5">⬢</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Pink band */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[120%] h-[80px] flex items-center bg-[#F15533] rotate-[-3deg] z-[2] shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                <div
                    className="flex items-center whitespace-nowrap"
                    style={{ animation: "marquee 22s linear infinite" }}
                >
                    {items.map((item, i) => (
                        <React.Fragment key={`pink-${i}`}>
                            <span className="text-white font-black text-[2.2rem] px-5">
                                {item}
                            </span>
                            <span className="text-white text-[1.3rem] mx-5">⬢</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarqueeBanner;