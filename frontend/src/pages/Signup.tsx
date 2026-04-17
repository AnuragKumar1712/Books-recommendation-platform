import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      await authService.register(name, gender, email, password);
      navigate("/login");
    } catch (err: any) {
      if (err.message?.includes("400")) {
        setError("Email already exists. Please login instead.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div
        className="
        w-full max-w-md
        bg-[var(--color-card)]
        border border-[var(--color-border)]
        rounded-xl
        p-8
        literary-shadow
        "
      >
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-[var(--color-card-foreground)]">
          Create your <span className="gradient-text">BookScope</span> account
        </h1>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Name */}
        <input
          className="
          w-full mt-6
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          px-3 py-2
          rounded-lg
          text-[var(--color-foreground)]
          placeholder:text-[var(--color-muted-foreground)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
          "
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Gender */}
        <select
          className="
          w-full mt-4
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          px-3 py-2
          rounded-lg
          text-[var(--color-foreground)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
          "
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Email */}
        <input
          className="
          w-full mt-4
          bg-[var(--color-background)]
          border border-[var(--color-border)]
          px-3 py-2
          rounded-lg
          text-[var(--color-foreground)]
          placeholder:text-[var(--color-muted-foreground)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
          "
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            className="
            w-full
            bg-[var(--color-background)]
            border border-[var(--color-border)]
            px-3 py-2
            rounded-lg
            pr-10
            text-[var(--color-foreground)]
            placeholder:text-[var(--color-muted-foreground)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
            "
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="
          w-full mt-6
          py-2 rounded-lg
          bg-gradient-to-r from-blue-500 to-violet-500
          text-white font-medium
          hover:scale-[1.02]
          hover:shadow-lg hover:shadow-blue-500/30
          transition
          "
        >
          Sign Up
        </button>

        {/* Login link */}
        <p className="mt-5 text-sm text-center text-[var(--color-muted-foreground)]">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
