"use client";

import { useState } from "react";
import { supabase } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx"; 

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [showSubmitError, setShowSubmitError] = useState(false);
  const redirectTo = useSearchParams().get("redirectTo") || "/";

  const router = useRouter();

  const validateEmail = (email: string) => {
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError((prev) => ({
        ...prev,
        emailError: "Invalid email address",
      }));
      return false;
    }
    setError((prev) => ({
      ...prev,
      emailError: "",
    }));
    return true;
  }

  const validatePassword = (pw: string) => {
    // Password must be at least 6 characters long and contain letters and numbers
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(pw)) {
      setError((prev) => ({
        ...prev,
        passwordError: "Password must be at least 6 characters long and contain letters and numbers",
      }));
      return false;
    }
    setError((prev) => ({
      ...prev,
      passwordError: "",
    }));
    return true;
  }

  const validateConfirmPassword = (pw: string) => {
    if (type === "signup" && password !== pw) {
      setError((prev) => ({
        ...prev,
        confirmPasswordError: "Passwords do not match",
      }));
      return false;
    }
    setError((prev) => ({
      ...prev,
      confirmPasswordError: "",
    }));
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    const valid = validateEmail(email) && validatePassword(password) && 
        (type === "signup" ? validateConfirmPassword(confirmPassword) : true);

    if (!valid) return;
    setShowSubmitError(true);

    if (type === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError((prev) => ({
          ...prev,
          signUp: signUpError.message,
        }));
        return;
      }

      const user = data.user;
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          display_name: displayName,
        });
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError((prev) => ({
          ...prev,
          signIn: signInError.message,
        }));
        return;
      }
    }

    router.push(redirectTo);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        validateEmail(value);
        break;
      case "password":
        validatePassword(value);
        break;
      case "confirmPassword":
        validateConfirmPassword(value);
        break;
      default:
        break;
    }
  } 

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {type === "signup" ? "Create an Account" : "Welcome Back"}
      </h2>

      {type === "signup" && (
        <div>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => handleInputChange(e)}
          name="email"
          className={clsx(
            "w-full p-2 border rounded focus:outline-none focus:ring",
            error.emailError ? "border-red-500" : "border-gray-300"
          )}
          required
        />
        {error?.emailError && (
          <p className="text-sm text-red-600 mt-1">{error.emailError}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => handleInputChange(e)}
          name="password"
          minLength={6}
          maxLength={20}
          className={clsx(
            "w-full p-2 border rounded focus:outline-none focus:ring",
            error?.passwordError ? "border-red-500" : "border-gray-300"
          )}
          required
        />
        {error?.passwordError && (
          <p className="text-sm text-red-600 mt-1">{error.passwordError}</p>
        )}
      </div>

      {type === "signup" && (
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={(e) => handleInputChange(e)}
            name="confirmPassword"
            className={clsx(
              "w-full p-2 border rounded focus:outline-none focus:ring",
              error?.confirmPasswordError ? "border-red-500" : "border-gray-300"
            )}
            required
          />
          {error?.confirmPasswordError && (
            <p className="text-sm text-red-600 mt-1">
              {error.confirmPasswordError}
            </p>
          )}
        </div>
      )}

      {Object.keys(error).length > 0 && showSubmitError && (
        <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded text-sm">
          {error.signIn || error.signUp}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
        disabled={Object.values(error).some((e) => e?.trim() !== "")}
      >
        {type === "signup" ? "Sign Up" : "Log In"}
      </button>

      <p className="text-sm text-center text-gray-600">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </>
        )}
      </p>
    </form>
  );
}
