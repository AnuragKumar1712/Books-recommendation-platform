import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      await authService.register(name, gender, email, password);
      navigate("/signup");
    } catch (err: any) {
      if (err.message?.includes("400")) {
        setError("Email already exists. Please login instead.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await authService.login(email, password);
      login(response.access_token, response.user);

      navigate(
        response.user.role === "admin" ? "/dashboard" : "/user-dashboard",
      );
    } catch {
      setError("Email not registered or password is incorrect");
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
          Login to <span className="gradient-text">BookScope</span>
        </h1>
        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}
        {/* Email */}
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
        {/* Forgot password */}
        <p className="text-sm text-right mt-2">
          <a
            href="/forgot-password"
            className="text-[var(--color-primary)] hover:underline"
          >
            Forgot password?
          </a>
        </p>
        {/* Login Button */}
        <button
          onClick={handleSubmit}
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
          Login
        </button>

        {/* Sign Up link */}
        <p className="mt-5 text-sm text-center text-[var(--color-muted-foreground)]">
          Don't have an account? {""}
          <button
            onClick={() => navigate("/signup")}
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
