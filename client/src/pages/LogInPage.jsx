import React, { useState } from 'react'
import { userAuthStore } from '../store/useAuthStore.js';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LogInPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
      fullName: '',
      password: '',
      profilePic: '',
      role: "Student",
      phone: "1234567890",
      country: "United States",
      timeZone: "America/New_York",
      gender: "Male",
      availability: []
    });
  
  const {logIn, isLoggingIn} = userAuthStore();

  const validatForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) return toast.error("Invalid Email");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = validatForm();
    if (success) {
        logIn(formData);
      }
  }

  return (
    <div className='container min-h-screen mx-auto flex items-center justify-center h-screen'>
        <div className="w-[80%] md:w-[40%]">
              <div className="flex flex-col justify-center items-center py-10">
                <div className="w-full space-y-8">
                  {/* LOGO */}
                  <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                      <div
                        className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                      group-hover:bg-primary/20 transition-colors bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"
                      >
                        <MessageSquare className="size-6 text-primary text-zinc-100" />
                      </div>
                      <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                      <p className="text-base-content/60">Sign in to your account</p>
                    </div>
                  </div>
    
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                      <label className="label form-label">
                        <span className="label-text font-medium">Email</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-base-content/40 dark:text-zinc-200" />
                        </div>
                        <input
                          type="email"
                          className={`input input-bordered w-full form-input`}
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label form-label">
                        <span className="label-text font-medium">Password</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-base-content/40 dark:text-zinc-200" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`input input-bordered w-full form-input`}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center dark:text-zinc-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-base-content/40" />
                          ) : (
                            <Eye className="h-5 w-5 text-base-content/40" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full primary-purple-btn flex items-center justify-center" disabled={isLoggingIn}>
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </form>
    
                  <div className="text-center">
                    <p className="text-base-content/60">
                      Don&apos;t have an account?{" "}
                      <Link to="/signup" className="link link-primary text-purple-300 underline">
                        Create account
                      </Link>
                    </p>
                  </div>

                </div>
              </div>
            </div>
        </div>
  )
}

export default LogInPage