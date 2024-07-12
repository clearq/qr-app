'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CardHeader } from '@/components/ui/card';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from '@/components/ui/use-toast';
import { createCustomer } from '@/actions/auth';

export const RegisterForm = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      company: "",
      orgNumber: ""
    },
    validationSchema: yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().matches(/(?=.*[0-9])/, 'Password must contain at least one number'),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      company: yup.string(),
      orgNumber: yup.string()
    }),
    onSubmit: async (values) => {
      // Determine roleId based on presence of company and orgNumber
      const roleId = values.company && values.orgNumber ? '2' : '1';

      // Create customer with the roleId
      await createCustomer({ ...values, roleId }).then((response) => {
        if (response?.customer) {
          toast({
            title: "Success",
            description: "Registered successfully"
          });
          router.replace("/login");
        } else {
          toast({
            title: "Error",
            description: response?.message
          });
          setError(response?.message);
        }
      });
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <CardHeader className="">
        Register
      </CardHeader>
      <form onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
      }}>
        <Input
          type="text"
          name="firstName"
          value={validation.values.firstName}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="First Name"
          required
        />
        <Input
          type="text"
          name="lastName"
          value={validation.values.lastName}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="Last Name"
          required
        />
        <Input
          type="email"
          name="email"
          value={validation.values.email}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="Email"
          required
        />
        <Input
          type="password"
          name="password"
          value={validation.values.password}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="Password"
          autoComplete="new-password"
          required
        />
        {validation.touched.password && validation.errors.password && (
          <div className="text-red-500">{validation.errors.password}</div>
        )}
        <Input
          type="text"
          name="company"
          value={validation.values.company}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="Company (optional)"
        />
        <Input
          type="text"
          name="orgNumber"
          value={validation.values.orgNumber}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          className="w-full border border-gray-30 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:text-black focus:border-blue-400"
          placeholder="Organization Number (optional)"
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
