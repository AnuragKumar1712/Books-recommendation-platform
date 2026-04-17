import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block md:inline-block transition font-medium ${
    isActive
      ? "text-[var(--color-primary)]"
      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
  }`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className="
      fixed top-0 left-0 w-full z-50
      bg-[var(--color-background)]/80
      backdrop-blur-md
      border-b border-[var(--color-border)]
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold gradient-text font-accent"
          >
            BookScope
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/books" className={navLinkClass}>
              Books
            </NavLink>

            <NavLink to="/analysis" className={navLinkClass}>
              Analysis
            </NavLink>

            <NavLink to="/recommendations" className={navLinkClass}>
              Recommendations
            </NavLink>

            {role === "user" && (
              <NavLink to="/user-dashboard" className={navLinkClass}>
                My Dashboard
              </NavLink>
            )}

            {role === "admin" && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {role === "guest" ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="
                  px-4 py-2 text-sm rounded-lg
                  bg-gradient-to-r from-blue-500 to-violet-500
                  text-white
                  hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30
                  transition cursor-pointer
                  "
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="
                  px-4 py-2 text-sm rounded-lg
                  border border-[var(--color-border)]
                  text-[var(--color-foreground)]
                  hover:bg-[var(--color-card)]
                  transition cursor-pointer
                  "
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  Welcome {user?.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="
                  px-3 py-1.5 text-sm
                  border border-red-500/40
                  text-red-400
                  rounded-lg
                  hover:bg-red-500/10
                  transition cursor-pointer
                  "
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--color-foreground)]"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="
          md:hidden
          bg-[var(--color-card)]
          border-t border-[var(--color-border)]
          "
        >
          <div className="space-y-3 px-4 pb-4 pt-3 font-medium">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/books"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Books
            </NavLink>

            <NavLink
              to="/analysis"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Analysis
            </NavLink>

            <NavLink
              to="/recommendations"
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Recommendations
            </NavLink>

            {role === "user" && (
              <NavLink
                to="/user-dashboard"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                My Dashboard
              </NavLink>
            )}

            {role === "admin" && (
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </NavLink>
            )}

            {/* Auth Section */}
            <div className="pt-3 border-t border-[var(--color-border)]">
              {role === "guest" ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="
                    w-full px-4 py-2 rounded-lg
                    bg-gradient-to-r from-blue-500 to-violet-500
                    text-white
                    "
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsOpen(false);
                    }}
                    className="
                    w-full px-4 py-2 rounded-lg
                    border border-[var(--color-border)]
                    text-[var(--color-foreground)]
                    mt-2
                    "
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="
                  w-full px-4 py-2 rounded-lg
                  border border-red-500/40
                  text-red-400
                  "
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
