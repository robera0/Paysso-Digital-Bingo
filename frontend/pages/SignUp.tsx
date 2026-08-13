import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Loader2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useSignUp, type SignupUser } from "../src/services/useLogin";
import { useLanguage } from "../src/LanguageContext";
import { translations } from "../src/translations";

const FIELD_WRAP = "rounded-xl border px-4 pt-5 pb-2.5 transition-colors";
const FIELD_IDLE =
  "border-slate-200 focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500";
const FIELD_ERROR = "border-red-400";

const SignupPage = () => {
  const [step, setStep] = useState(1);

  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const { mutate: registerMutation, isPending } = useSignUp();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].signup;

  const validateEmail = (val: string) => {
    setEmail(val);
    setEmailError(
      val && !val.includes("@")
        ? "Add a valid email address (missing '@')"
        : "",
    );
  };

  const handleNextStep = () => {
    setFormError("");
    if (
      !fullname.trim() ||
      !username.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setFormError("Please fill in all required fields");
      return;
    }
    if (!email.includes("@")) {
      setEmailError("Add a valid email address (missing '@')");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    registerMutation({
      email,
      password,
      phone,
      fullname,
      username,
    } as SignupUser);
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
      {/* Language Toggle */}
      <div className="absolute right-6 top-8">
        <button
          onClick={toggleLanguage}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {language === 'en' ? 'አማርኛ' : 'English'}
        </button>
      </div>

      {/* Brand mark */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 shadow-sm shadow-slate-900/10">
        <Leaf size={26} className="text-slate-100" strokeWidth={2} />
      </div>

      <h1 className="mb-1.5 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {t.createAccount}
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500 sm:text-base">
        {t.joinCommunity}
      </p>

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100 backdrop-blur-sm sm:p-8 lg:max-w-lg">
        {/* Progress indicator */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                step >= 1 ? "bg-slate-700" : "bg-slate-200"
              }`}
            />
            <span
              className={`mt-2 block text-xs font-medium transition-colors ${
                step >= 1 ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {t.profileDetails}
            </span>
          </div>
          <div className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                step >= 2 ? "bg-slate-700" : "bg-slate-200"
              }`}
            />
            <span
              className={`mt-2 block text-right text-xs font-medium transition-colors ${
                step >= 2 ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {t.security}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className={`${FIELD_WRAP} ${FIELD_IDLE} relative`}>
                  <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                    {t.fullName}
                  </label>
                  <div className="flex items-center gap-3">
                    <UserRound size={18} className="shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFullName(e.target.value)
                      }
                      placeholder={t.egAbebe}
                      className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300"
                    />
                  </div>
                </div>

                <div className={`${FIELD_WRAP} ${FIELD_IDLE} relative`}>
                  <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                    {t.username}
                  </label>
                  <div className="flex items-center gap-3">
                    <UserRound size={18} className="shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                      }
                      placeholder={t.chooseUsername}
                      className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300"
                    />
                  </div>
                </div>

                <div className={`${FIELD_WRAP} ${FIELD_IDLE} relative`}>
                  <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                    {t.phoneNumber}
                  </label>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPhone(e.target.value)
                      }
                      placeholder="09xx xxx xxx"
                      className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <div
                    className={`${FIELD_WRAP} ${emailError ? FIELD_ERROR : FIELD_IDLE} relative`}
                  >
                    <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                      {t.email}
                    </label>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="shrink-0 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          validateEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300"
                      />
                    </div>
                  </div>
                  {emailError ? (
                    <p className="mt-1.5 pl-1 text-xs text-red-500">
                      {emailError}
                    </p>
                  ) : null}
                </div>
              </div>

              {formError ? (
                <p className="mt-4 text-sm text-red-500">{formError}</p>
              ) : null}

              <button
                type="button"
                onClick={handleNextStep}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                {t.nextStep}
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className={`${FIELD_WRAP} ${FIELD_IDLE} relative`}>
                  <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                    {t.password}
                  </label>
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="shrink-0 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      disabled={isPending}
                      placeholder={t.atLeast8}
                      className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={`${FIELD_WRAP} ${FIELD_IDLE} relative`}>
                  <label className="absolute left-11 top-1.5 text-[11px] font-medium text-slate-400">
                    {t.confirmPassword}
                  </label>
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="shrink-0 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                      }
                      disabled={isPending}
                      placeholder={t.reEnterPassword}
                      className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-300 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {formError ? (
                <p className="mt-4 text-sm text-red-500">{formError}</p>
              ) : null}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setFormError("");
                  }}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-70"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-700 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t.creating}
                    </>
                  ) : (
                    <>
                      {t.createAccount}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {t.alreadyHaveAccount}{" "}
        <Link to="/" className="font-bold text-slate-700 hover:underline">
          {t.signIn}
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
