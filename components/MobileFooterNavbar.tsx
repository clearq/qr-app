"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaListAlt, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { Button } from "./ui/button";

interface Props {
  user?: { firstName: string; lastName: string };
}

const MobileFooterNavbar: React.FC<Props> = ({ user }) => {
  return (
    <div className="sm:hidden">
      <div className="flex fixed bottom-0 inset-x-0 bg-white shadow-md py-3 justify-around items-center">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          <FaHome size={24} />
        </Link>
        <Link href="/all" className="text-blue-500 hover:text-blue-700">
          <FaListAlt size={24} />
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="text-blue-500 hover:text-blue-700">
              <FaUserAlt size={24} />
            </Link>
            <Button className="text-red-500 hover:text-red-700">
              <FaSignOutAlt size={24} />
            </Button>
          </>
        ) : (
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            <FaUserAlt size={24} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileFooterNavbar;
