// Import necessary libraries
'use client'
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Profile: React.FC = () => {
  // Fetch session data
  const { data: session } = useSession();

  return (
    <div className="max-w-lg mx-auto py-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {/* If user session exists */}
        {session && (
          <div>
            <div className="flex items-center mb-6">
              {/* User Avatar */}
              <Image
                src={session.user?.image || '/default-avatar.png'}
                alt="User Avatar"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <p className="text-xl font-semibold">{session.user?.name}</p>
                <p className="text-gray-500">{session.user?.email}</p>
              </div>
            </div>
            {/* Additional user information */}
            {/* Replace with actual user data */}
            <div>
              {/* <p className="mb-2">
                <span className="font-semibold">Location:</span>{" "}
                {session.user?.location || "Not provided"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Bio:</span>{" "}
                {session.user?.bio || "Not provided"}
              </p> */}
              {/* Add more fields as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
