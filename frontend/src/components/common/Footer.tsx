import { NavLink } from "react-router-dom";

const footerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block transition ${
    isActive
      ? "text-[var(--color-primary)]"
      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
  }`;

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text font-accent">
              BookScope
            </h3>

            <p className="mt-3 text-sm text-[var(--color-muted-foreground)] max-w-xs">
              A data-driven platform for book analysis, insights, and
              intelligent recommendations powered by analytics and machine
              learning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-[var(--color-card-foreground)]">
              Platform
            </h4>

            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <NavLink to="/" className={footerLinkClass}>
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/books" className={footerLinkClass}>
                  Books
                </NavLink>
              </li>

              <li>
                <NavLink to="/analysis" className={footerLinkClass}>
                  Analysis
                </NavLink>
              </li>

              <li>
                <NavLink to="/recommendations" className={footerLinkClass}>
                  Recommendations
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-[var(--color-card-foreground)]">
              Resources
            </h4>

            <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                Documentation
              </li>

              <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                API Reference
              </li>

              <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                GitHub
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-[var(--color-card-foreground)]">
              Contact
            </h4>

            <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li>Email: support@bookscope.ai</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-muted-foreground)]">
          © {new Date().getFullYear()} BookScope. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
