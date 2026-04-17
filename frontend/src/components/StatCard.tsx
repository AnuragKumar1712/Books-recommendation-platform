interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div
      className="
    bg-[var(--color-card)]
    border border-[var(--color-border)]
    rounded-xl
    p-6
    flex items-center gap-4
    literary-shadow
    book-hover
    literary-transition
    "
    >
      <div className="text-[var(--color-primary)] text-3xl">{icon}</div>

      <div>
        <p className="text-sm text-[var(--color-muted-foreground)]">{label}</p>

        <p className="text-2xl font-bold text-[var(--color-card-foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
