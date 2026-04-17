import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      await authService.forgotPassword(email);

      setMessage(
        "Reset link sent to registered email. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch {
      setMessage(
        "Reset link sent to registered email. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } finally {
      setLoading(false);
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
          Forgot your <span className="gradient-text">BookScope</span> password?
        </h1>

        <p className="mt-3 text-sm text-center text-[var(--color-muted-foreground)]">
          Enter your email and we will send you a reset link.
        </p>

        {/* Email Input */}
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

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
          w-full mt-6
          py-2 rounded-lg
          bg-gradient-to-r from-blue-500 to-violet-500
          text-white font-medium
          hover:scale-[1.02]
          hover:shadow-lg hover:shadow-blue-500/30
          transition
          disabled:opacity-60
          "
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-center text-green-400">{message}</p>
        )}

        {/* Back to Login */}
        <p className="mt-5 text-sm text-center text-[var(--color-muted-foreground)]">
          Remember your password?{" "}
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

export default ForgotPassword;
