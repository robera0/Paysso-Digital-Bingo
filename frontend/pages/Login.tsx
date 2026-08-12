import { Leaf, Lock, Eye, ArrowRight, Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin, type Credentials } from "../src/services/useLogin";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState<string>("");
  const { mutate: loginMutation, isPending } = useLogin();
  const credentials: Credentials = {
    identifier,
    password,
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start px-6 py-10 md:justify-center md:py-0"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(248,250,250,0.90) 0%, rgba(220,232,240,0.95) 45%), url(/Block_bingo.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-700 flex items-center justify-center mb-6 shadow-sm">
        <Leaf size={34} className="text-slate-100" strokeWidth={2} />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
      <p className="text-slate-500 text-base mb-10">
        Sign in to continue your bingo journey
      </p>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
        <img
          src="/Block_bingo.jpeg"
          alt="Bingo login artwork"
          className="w-full h-40 object-cover rounded-3xl mb-6"
        />
        {/* Identifier field */}
        <label className="block text-xs font-bold tracking-wide text-gray-700 mb-2">
          EMAIL OR PHONE NUMBER
        </label>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 mb-6">
          <Phone size={18} className="text-gray-400 shrink-0" />

          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone number"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>

        {/* Password field */}
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold tracking-wide text-gray-700">
            PASSWORD
          </label>
          <span className="text-sm font-semibold text-slate-700">Forgot?</span>
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
          disabled={isPending}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            loginMutation(credentials);
          }}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-70 disabled:cursor-wait"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Logging in... please wait
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8">
        Don't have an account?{" "}
        <Link to="/signup" className="text-slate-700 font-bold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
