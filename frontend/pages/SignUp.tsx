import {
  ArrowRight,
  Eye,
  Leaf,
  Lock,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState, type ChangeEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useSignUp, type SignupUser } from "../src/services/useLogin";

const SignupPage = () => {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { mutate: registerMutation, isPending } = useSignUp();

  const credentials: SignupUser = {
    email,
    password,
    phone,
    fullname,
    username,
  };

  const validateEmail = (val: string) => {
    setEmail(val);
    setEmailError(
      val && !val.includes("@")
        ? "Add a valid email address (missing '@')"
        : "",
    );
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      !fullname.trim() ||
      !username.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setPasswordError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordError("");
    registerMutation(credentials);
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center px-3 py-6 sm:px-6 sm:pt-16"
      style={{
        background: "linear-gradient(180deg, #DCEFDD 0%, #F3F5F2 45%)",
      }}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#4CAF50] shadow-sm sm:mb-6 sm:h-20 sm:w-20">
        <Leaf size={34} className="text-[#1B4B1F]" strokeWidth={2} />
      </div>

      <h1 className="mb-2 text-2xl font-bold text-[#1B7A2E] sm:text-3xl">
        Create Account
      </h1>
      <p className="mb-6 text-sm text-gray-500 sm:mb-10 sm:text-base">
        Join the bingo community and get started
      </p>

      <div className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <UserRound size={18} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={fullname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            placeholder="Full name"
            className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <UserRound size={18} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <Phone size={18} className="shrink-0 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            placeholder="Phone number"
            className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
          />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <Mail size={18} className="shrink-0 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              validateEmail(e.target.value)
            }
            placeholder="Enter your email"
            className={`w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none ${
              emailError ? "border-b-2 border-red-500" : ""
            }`}
          />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <Lock size={18} className="shrink-0 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Create a password"
            className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
          />
          <Eye size={18} className="shrink-0 text-gray-500" />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 sm:mb-6 sm:px-4 sm:py-3.5">
          <Lock size={18} className="shrink-0 text-gray-400" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm your password"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
          <Eye size={18} className="shrink-0 text-gray-500" />
        </div>

        {passwordError ? (
          <p className="mb-3 text-sm text-red-500">{passwordError}</p>
        ) : null}

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B7A2E] py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500 sm:mt-8">
        Already have an account?{" "}
        <Link to="/" className="font-bold text-[#1B7A2E] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
