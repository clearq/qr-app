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
          className="text-cyan-600 hover:text-cyan-700 ml-1 mr-1 font-semibold transition-colors duration-300"
        >
          ClearQ
        </a>
        <span className="hidden sm:inline-block ">|</span>
        <span className="">in cooperation with</span>
        <a
          href="https://timeer.se"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 mr-1 ml-1 hover:text-cyan-700 font-semibold transition-colors duration-300"
        >
          Timeer
        </a>
        <span className="">and</span>
        <a
          href="https://timeer.se"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 ml-1 hover:text-cyan-700 font-semibold transition-colors duration-300"
        >
          Staffin
        </a>
      </div>
    </footer>
  );
};

export default Footer;
