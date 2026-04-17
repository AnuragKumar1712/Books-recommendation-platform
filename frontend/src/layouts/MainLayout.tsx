import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-violet-500/20 blur-3xl rounded-full"></div>

      {/* Content */}
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
