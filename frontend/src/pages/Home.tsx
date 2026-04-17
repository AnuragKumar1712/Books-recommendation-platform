import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import StatCard from "../components/StatCard";
import FeaturedCarousel from "../components/books/FeaturedCarousel";

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero />

      {/* Book Carousel */}
      <FeaturedCarousel />

      {/* Features Section */}
      <section className="mt-20 max-w mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-(--color-foreground)">
          Platform Features
        </h2>
        <p className="mt-4 text-center text-(--color-muted-foreground) max-w-2xl mx-auto">
          Powerful tools to analyze books, understand trends, and generate
          intelligent recommendations.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Book Data Analysis"
            description="Analyze ratings, reviews, genres, and trends across thousands of books."
            icon={<span>📊</span>}
          />
          <FeatureCard
            title="Genre Insights"
            description="Discover popular genres, emerging trends, and reader preferences."
            icon={<span>📚</span>}
          />
          <FeatureCard
            title="Smart Recommendations"
            description="Get personalized book suggestions using data-driven models."
            icon={<span>🤖</span>}
          />
          <FeatureCard
            title="Interactive Dashboards"
            description="Visualize insights with charts and summary statistics."
            icon={<span>📈</span>}
          />
          <FeatureCard
            title="Scalable Architecture"
            description="Designed to integrate ML models and real-time APIs."
            icon={<span>⚙️</span>}
          />
          <FeatureCard
            title="Modern UI"
            description="Responsive, clean, and user-friendly interface."
            icon={<span>✨</span>}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-24 bg-(--color-card) py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-(--color-foreground)">
            Platform at a Glance
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Books Analyzed"
              value="50K+"
              icon={<span>📘</span>}
            />
            <StatCard
              label="Genres Covered"
              value="120+"
              icon={<span>🏷️</span>}
            />
            <StatCard
              label="Average Rating"
              value="4.2 / 5"
              icon={<span>⭐</span>}
            />
            <StatCard
              label="Recommendations Generated"
              value="1M+"
              icon={<span>🚀</span>}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
