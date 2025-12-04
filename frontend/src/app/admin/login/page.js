"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0e7ff] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#17192d] dark:via-[#1e223c] dark:to-[#16182b]">
      <div className="w-full max-w-md p-0 m-3">
        <div className="bg-white dark:bg-[#23263a] border border-blue-100 dark:border-[#292c45] rounded-xl shadow-lg px-8 py-10 flex flex-col">
          <div className="flex flex-col items-center mb-7">
            <Image
              src="/atorix-logo.png"
              alt="Atorix IT Logo"
              width={100}
              height={40}
              className="mb-2"
              priority
            />
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400 tracking-tight mb-0.5">Admin Login</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">Sign in to manage Atorix</span>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded flex gap-2 items-center mb-5 text-sm border border-red-200 dark:border-red-500/30">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm mb-1 font-medium text-gray-800 dark:text-white">Username or Email</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md border border-blue-100 dark:border-[#343753] bg-[#f3f6fa] dark:bg-[#242547] px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900 transition outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                placeholder="Enter username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 font-medium text-gray-800 dark:text-white">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-blue-100 dark:border-[#343753] bg-[#f3f6fa] dark:bg-[#242547] px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900 transition outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full font-semibold text-base bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-800 text-white py-2.5 rounded-md shadow-sm mt-3 transition-all disabled:opacity-70"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Log In<LogIn className="h-5 w-5 ml-1"/></span>
              )}
            </Button>
          </form>
        </div>
        <p className="mt-7 text-xs text-gray-500 dark:text-gray-500/80 text-center">&copy; {new Date().getFullYear()} Atorix IT. Admin access only.</p>
      </div>
    </div>
  );
}
