import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    try {
      await authService.resetPassword(token, password);
      setSuccess("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Reset link is invalid or expired");
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
          Reset your <span className="gradient-text">BookScope</span> password
        </h1>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Success */}
        {success && (
          <p className="mt-4 text-sm text-green-400 text-center">{success}</p>
        )}

        {/* Password */}
        <div className="relative mt-6">
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
            placeholder="New Password"
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

        {/* Reset Button */}
        <button
          onClick={handleReset}
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
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
