import { Leaf, Mail, Lock, Eye, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { useLogin, type Credentials } from "../src/services/useLogin";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate: loginMutation } = useLogin();
  const credentials: Credentials = {
    email: email,
    password: password,
  };
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center px-6 pt-16"
      style={{
        background: "linear-gradient(180deg, #DCEFDD 0%, #F3F5F2 45%)",
      }}
    >
      <div className="w-20 h-20 rounded-3xl bg-[#4CAF50] flex items-center justify-center mb-6 shadow-sm">
        <Leaf size={34} className="text-[#1B4B1F]" strokeWidth={2} />
      </div>

      <h1 className="text-3xl font-bold text-[#1B7A2E] mb-2">Welcome Back</h1>
      <p className="text-gray-500 text-base mb-10">
        Sign in to continue your bingo journey
      </p>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
        {/* Email field */}
        <label className="block text-xs font-bold tracking-wide text-gray-700 mb-2">
          EMAIL ADDRESS
        </label>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 mb-6">
          <Mail size={18} className="text-gray-400 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>

        {/* Password field */}
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold tracking-wide text-gray-700">
            PASSWORD
          </label>
          <span className="text-sm font-semibold text-[#1B7A2E]">Forgot?</span>
        </div>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 mb-6">
          <Lock size={18} className="text-gray-400 shrink-0" />
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
          <Eye size={18} className="text-gray-500 shrink-0" />
        </div>

        {/* Sign in button */}
        <button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            loginMutation(credentials);
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#1B7A2E] text-white font-semibold py-3.5 rounded-xl"
        >
          Sign In
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8">
        Don't have an account?{" "}
        <span className="text-[#1B7A2E] font-bold">Create one</span>
      </p>
    </div>
  );
};

export default Login;
