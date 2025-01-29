"use client";

import Image from "next/image";

const ThemeImage = () => {
  return (
    <div className="theme-image">
      {/* <Image
        alt="logo"
        src="/image/QaafBlack.png" // Default image
        width={50}
        height={50}
        className="w-[50px] h-auto light-image"
        priority
      /> */}
      <Image
        alt="logo"
        src="/image/QaafGold.png" // Dark mode image
        width={50}
        height={50}
        className="w-[50px] h-auto"
        priority
      />
    </div>
  );
};

export default ThemeImage;
