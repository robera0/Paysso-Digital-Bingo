import { Leaf, Lock, Eye, EyeOff, ArrowRight, Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin, type Credentials } from "../src/services/useLogin";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginMutation, isPending } = useLogin();
  const credentials: Credentials = {
    identifier,
    password,
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-8"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(232,237,243,0.94) 0%, rgba(248,250,252,0.97) 55%), url(/Block_bingo.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Brand mark */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 shadow-sm shadow-slate-900/10">
        <Leaf size={26} className="text-slate-100" strokeWidth={2} />
      </div>

      <h1 className="mb-1.5 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Welcome Back
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500 sm:text-base">
        Sign in to continue your bingo journey
      </p>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100 backdrop-blur-sm sm:p-7">
        {/* Artwork Image */}
        <img
          src="/Block_bingo.jpeg"
          alt="Bingo login artwork"
          className="mb-5 h-32 w-full rounded-2xl object-cover shadow-sm"
        />

        {/* Identifier field */}
        <label className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-500">
          EMAIL OR PHONE NUMBER
        </label>
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500">
          <Phone size={18} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone number"
            className="w-full bg-transparent text-slate-700 placeholder-slate-400 outline-none"
          />
        </div>

        {/* Password field */}
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-[11px] font-bold tracking-wide text-slate-500">
            PASSWORD
          </label>
          <span className="cursor-pointer text-xs font-semibold text-slate-700 hover:underline">
            Forgot?
          </span>
        </div>
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500">
          <Lock size={18} className="shrink-0 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            className="w-full bg-transparent text-slate-700 placeholder-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Sign in button */}
        <button
          type="button"
          disabled={isPending}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            loginMutation(credentials);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Logging in...
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
      <p className="mt-6 text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/signup" className="font-bold text-slate-700 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
