interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div
      className="
    bg-[var(--color-card)]
    border border-[var(--color-border)]
    rounded-xl
    p-6
    literary-shadow
    book-hover
    literary-transition
    "
    >
      <div className="mb-4 text-[var(--color-primary)] text-3xl">{icon}</div>

      <h3 className="text-lg font-semibold text-[var(--color-card-foreground)]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
