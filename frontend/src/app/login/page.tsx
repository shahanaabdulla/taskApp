"use client";

import { useState, useEffect } from "react"; 
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; 

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function Login() {
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false); 
  const router = useRouter();

  
  useEffect(() => {
    setIsMounted(true);

    // Redirect authenticated users away from the login page
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/"); // Redirect to home page if already logged in
    }
  }, [router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      // Store token and username in localStorage
      localStorage.setItem("token", response.data.token); // Store token in localStorage
      localStorage.setItem("username", response.data.username); // Store username in localStorage

      router.replace("/"); 
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  // Render nothing until the component mounts on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        {error && (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Formik form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, handleBlur, handleChange, values }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}