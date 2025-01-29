import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center">
      <div className="mb-4 gap-2 sm:gap-4 text-[12px] sm:text-base">
        <span className="">Powered by</span>
        <a
          href="https://clearq.se"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8B7500] bg-clip-text text-transparent hover:from-[#F2BF49] hover:via-[#C5A005] hover:to-[#937100] ml-1 mr-1 font-semibold transition-all duration-300"
        >
          ClearQ
        </a>
        <span className="hidden sm:inline-block text-[#D4AF37]">|</span>
        <span className="">in cooperation with</span>
        <a
          href="https://timeer.se"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8B7500] bg-clip-text text-transparent hover:from-[#F2BF49] hover:via-[#C5A005] hover:to-[#937100] mr-1 ml-1 font-semibold transition-all duration-300"
        >
          Timeer
        </a>
        <span className="">and</span>
        <a
          href="https://timeer.se"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8B7500] bg-clip-text text-transparent hover:from-[#F2BF49] hover:via-[#C5A005] hover:to-[#937100] ml-1 font-semibold transition-all duration-300"
        >
          Staffin
        </a>
      </div>
    </footer>
  );
};

export default Footer;
