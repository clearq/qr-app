'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CardHeader } from '@/components/ui/card';

const Register = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      } else {
        setError('');
        router.push('/login');
      }
    } catch (error) {
      setError('An error occurred while processing the request');
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
        <CardHeader className="">
          Register
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"

            placeholder="First Name"
            required
          />
          <Input
            type="text"
            name="lastName"
            className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
            placeholder="Last Name"
            required
          />
          <Input
            type="email"
            name="email"
            className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
            placeholder="Email"
            required
          />
          <Input
            type="password"
            name="password"
            className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Register
          </button>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </form>

        <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            href="/login"
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            Login with existing account
          </Link>
    </div>
  );
};

export default Register;
