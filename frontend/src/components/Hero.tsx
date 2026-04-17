import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 relative">
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold max-w-5xl leading-tight">
        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Data-Driven Book Analysis
        </span>
        <br />
        <span className="text-[var(--color-foreground)]">
          & Intelligent Recommendations
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-[var(--color-muted-foreground)] text-base sm:text-lg">
        Explore reading trends, analyze book data, and discover personalized
        recommendations powered by analytics and machine learning.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <NavLink to="/analysis">
          <button
            className="px-6 py-3 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-500 to-violet-500
          hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40
          transition cursor-pointer"
          >
            Explore Analysis
          </button>
        </NavLink>

        <NavLink to="/recommendations">
          <button
            className="px-6 py-3 rounded-lg font-medium
          border border-[var(--color-border)]
          text-[var(--color-foreground)]
          hover:bg-[var(--color-card)]
          transition cursor-pointer"
          >
            Get Recommendations
          </button>
        </NavLink>
      </div>
    </section>
  );
};

export default Hero;
